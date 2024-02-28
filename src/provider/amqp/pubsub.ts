import { PubSubEngine } from 'graphql-subscriptions'
import { goAwaited } from 'src/utils/common'
import amqp from 'amqplib'
import { AsyncIterator } from '@nestjs/apollo/dist/utils/async-iterator.util'
import { AMQPPublisher, PublishOptions } from './core/publisher'
import { PubSubAMQPConfig } from './core/interface'
import { AMQPSubscriber, SubscribeOptions } from './core/subscriber'
import { PubSubAsyncIterator } from './pubsub-async-iterator'
import { Anything } from 'src/types/common'

/**
 * RabbitMQ PubSub
 */

type ListenerFunc = (triggerName: string, content: Anything, message?: amqp.ConsumeMessage | null) => void
export class AMQPPubSub implements PubSubEngine {
  private connection: amqp.Connection
  private publisher: AMQPPublisher
  private subscriber: AMQPSubscriber
  private config?: PubSubAMQPConfig
  private currentSubscriptionId = 0
  private subscriptionMap: Record<number, { triggerName: string; listener: ListenerFunc }> = {}
  private subsRefsMap: Record<string, number[]> = {}
  private unsubscribeMap: Record<string, () => PromiseLike<Anything>> = {}

  constructor(url: string, exchange?: PubSubAMQPConfig['exchange']) {
    const _init = async () => {
      const [err, conn] = await goAwaited(() => amqp.connect(url))
      if (err || !conn) {
        console.error('Rabbitmq connection error', err)
        return
      }
      const { options, ...restExchange } = exchange || {}

      this.config = {
        connection: conn,
        exchange: {
          name: 'graphql',
          type: 'topic',
          options: {
            durable: false,
            autoDelete: false,
            ...options,
          },
          ...restExchange,
        },
      }

      this.connection = conn
      this.publisher = new AMQPPublisher(this.config)
      this.subscriber = new AMQPSubscriber(this.config)
    }

    _init()
  }

  async publish(triggerName: string, payload: Anything, options?: PublishOptions): Promise<void> {
    return this.publisher.publish(triggerName, payload, options)
  }

  async subscribe(
    triggerName: string,
    onMessage: ListenerFunc,
    args: Anything,
    options?: SubscribeOptions,
  ): Promise<number> {
    const id = this.currentSubscriptionId
    this.currentSubscriptionId++
    this.subscriptionMap[id] = {
      triggerName: triggerName,
      listener: onMessage,
    }

    const ids = this.subsRefsMap[triggerName] || []

    // If we already have a subscriber to this trigger
    // then don't create another one and just add this id to the list of ids for this trigger
    if (ids.length > 0) {
      this.subsRefsMap[triggerName] = [...ids, id]
      return id
    }

    // If we don't have a subscriber to this trigger then create one and add it to the map along with this id
    this.subsRefsMap[triggerName] = [id]

    const unsubscribeFunction = this.unsubscribeMap[triggerName] || Promise.resolve

    console.log('Subscribing to "%s" with id: "%s"', triggerName, id)
    const [newUnsubscribeFunction] = await Promise.all([
      this.subscriber.subscribe(triggerName, this.onMessage, args, options),
      unsubscribeFunction,
    ])

    this.unsubscribeMap[triggerName] = newUnsubscribeFunction

    return id
  }

  async createChannel() {
    return this.publisher.createChannel()
  }

  unsubscribe(subId: number): Anything {
    const sub = this.subscriptionMap[subId]
    if (!sub) {
      throw new Error(`There is no subscription for id "${subId}"`)
    }
    const { triggerName } = sub

    const refs = this.subsRefsMap[triggerName]
    if (!refs) {
      throw new Error(`There is no subscription ref for routing key "${triggerName}", id "${subId}"`)
    }
    console.log('Unsubscribing from "%s" with id: "%s"', triggerName, subId)

    if (refs.length === 1) {
      delete this.subscriptionMap[subId]
      return this.unsubscribeForKey(triggerName)
    }

    const index = refs.indexOf(subId)
    this.subsRefsMap[triggerName] = index === -1 ? refs : [...refs.slice(0, index), ...refs.slice(index + 1)]
    delete this.subscriptionMap[subId]
  }

  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return new PubSubAsyncIterator<T>(this, triggers)
  }

  private onMessage = (triggerName: string, content: string, message: amqp.ConsumeMessage | null): void => {
    const subscribers = this.subsRefsMap[triggerName] || []

    // Don't work for nothing...
    if (!subscribers || !subscribers.length) {
      this.unsubscribeForKey(triggerName).catch((err) => {
        console.log('unsubscribeForKey error "%j", Routing Key "%s"', err, triggerName)
      })
      return
    }

    for (const subId of subscribers) {
      this.subscriptionMap[subId].listener(content, message)
    }
  }

  private async unsubscribeForKey(triggerName: string): Promise<void> {
    const dispose = this.unsubscribeMap[triggerName]
    delete this.unsubscribeMap[triggerName]
    delete this.subsRefsMap[triggerName]
    await dispose()
  }
}
