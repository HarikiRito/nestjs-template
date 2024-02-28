import { Connection, Options } from 'amqplib'

export interface Exchange {
  name: string
  type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string
  options?: Options.AssertExchange
}

export interface Queue {
  name?: string
  options?: Options.AssertQueue
  unbindOnDispose?: boolean
  deleteOnDispose?: boolean
}

export interface PubSubAMQPConfig {
  connection: Connection
  exchange: Exchange
}
