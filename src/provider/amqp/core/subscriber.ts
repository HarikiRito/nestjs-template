import amqp from 'amqplib'
import { Exchange, PubSubAMQPConfig, Queue } from './interface'
import { AMQPUtilities } from 'src/provider/amqp/utils'
import { Anything } from 'src/types/common'

export interface SubscribeOptions {
  options?: amqp.Options.Consume
  channel?: amqp.Channel
}
export class AMQPSubscriber {
  private connection: amqp.Connection
  private exchange: Exchange
  private channel: amqp.Channel | null = null
  private queue: Queue
  constructor(config: PubSubAMQPConfig) {
    const { connection, exchange } = config

    this.connection = connection
    this.exchange = exchange

    this.queue = {
      options: {
        durable: false,
        autoDelete: false,
        exclusive: true,
      },
    }
  }

  public async subscribe(
    routingKey: string,
    action: (routingKey: Exchange['type'], content: Anything, message: amqp.ConsumeMessage | null) => void,
    args?: Anything,
    options?: SubscribeOptions,
  ): Promise<() => Promise<void>> {
    // Create and bind queue
    const { options: consumerOptions, channel: customChannel } = options || {}
    const channel = customChannel ?? (await this.createChannel())
    await channel.assertExchange(this.exchange.name, this.exchange.type, this.exchange.options)
    const queue = await channel.assertQueue(this.queue.name || '', this.queue.options)
    await channel.bindQueue(queue.queue, this.exchange.name, routingKey, args)

    // Listen for messages
    const consumer = await channel.consume(
      queue.queue,
      (msg) => {
        const content = AMQPUtilities.convertMessage(msg)
        action(routingKey, content, msg)
      },
      { noAck: true, ...consumerOptions },
    )

    // Dispose callback
    return async (): Promise<void> => {
      console.log('Disposing Subscriber to Queue "%s" (%s)', queue.queue, consumer.consumerTag)
      const channel = await this.createChannel()
      await channel.cancel(consumer.consumerTag)
      if (this.queue.unbindOnDispose) {
        await channel.unbindQueue(queue.queue, this.exchange.name, routingKey)
      }
      if (this.queue.deleteOnDispose) {
        await channel.deleteQueue(queue.queue)
      }
    }
  }

  private async createChannel(): Promise<amqp.Channel> {
    this.channel ??= await this.connection.createChannel()

    return this.channel
  }
}
