import { Module } from '@nestjs/common'
import { SampleService } from 'src/modules/sample/services/sample.service'
import { SampleResolver } from 'src/modules/sample/resolvers/sample.resolver'

@Module({
  controllers: [],
  imports: [],
  providers: [SampleService, SampleResolver],
})
export class SampleModule {}
