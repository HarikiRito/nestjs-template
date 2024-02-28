import amqp from 'amqplib'
import { Exchange, PubSubAMQPConfig } from './interface'
import { Anything } from 'src/types/common'

export interface PublishOptions {
  publishOptions?: amqp.Options.Publish
  channel?: amqp.Channel
}

export class AMQPPublisher {
  private connection: amqp.Connection
  private exchange: Exchange
  private channel: amqp.Channel | null = null

  constructor(config: PubSubAMQPConfig) {
    const { connection, exchange } = config

    this.connection = connection
    this.exchange = exchange
  }

  async publish(triggerName: string, payload: Anything, options?: PublishOptions): Promise<void> {
    const { publishOptions, channel: customChannel } = options || {}
    const channel = customChannel ?? (await this.createChannel())

    await channel.assertExchange(this.exchange.name, this.exchange.type, this.exchange.options)

    channel.publish(this.exchange.name, triggerName, Buffer.from(JSON.stringify(payload)), publishOptions)
  }

  async createChannel(): Promise<amqp.Channel> {
    this.channel ??= await this.connection.createChannel()

    return this.channel
  }
}
