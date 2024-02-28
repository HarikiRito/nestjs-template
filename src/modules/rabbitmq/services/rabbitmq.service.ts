import { Injectable, OnModuleInit } from '@nestjs/common'
import { envVars } from 'src/config/envConfig'
import { AMQPPubSub } from 'src/provider/amqp/pubsub'
import { PublishOptions } from 'src/provider/amqp/core/publisher'
import { Anything } from 'src/types/common'

const rabbitmqConfig = envVars.rabbitmq
const pubsub = new AMQPPubSub(`amqp://${rabbitmqConfig.host}:${rabbitmqConfig.port}`)
@Injectable()
export class RabbitmqService implements OnModuleInit {
  public pubsub: AMQPPubSub
  constructor() {}

  async onModuleInit() {
    this.pubsub = pubsub
  }
  async publish(triggerName: string, payload: Anything, options?: PublishOptions): Promise<void> {
    return this.pubsub.publish(triggerName, payload, options)
  }

  async asyncIterator<T>(triggers: string | string[]): Promise<AsyncIterator<T>> {
    return this.pubsub.asyncIterator<T>(triggers)
  }

  async createChannel() {
    return this.pubsub.createChannel()
  }
}
