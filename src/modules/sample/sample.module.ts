import { Module } from '@nestjs/common'
import { SampleController } from 'src/modules/sample/controllers/sample.controller'
import { SampleService } from 'src/modules/sample/services/sample.service'
import { SampleResolver } from 'src/modules/sample/resolvers/sample.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SampleEntity } from 'src/modules/sample/entities/sample.entity'
import { SampleRepository } from 'src/modules/sample/repositories/sample.repository'

@Module({
  controllers: [SampleController],
  imports: [TypeOrmModule.forFeature([SampleEntity])],
  providers: [SampleService, SampleResolver],
})
export class SampleModule {}
