import { Module } from '@nestjs/common'
import { RabbitmqService } from 'src/modules/rabbitmq/services/rabbitmq.service'

@Module({
  controllers: [],
  imports: [],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
