import { Module } from '@nestjs/common'
import { SampleService } from 'src/modules/sample/services/sample.service'
import { SampleResolver } from 'src/modules/sample/resolvers/sample.resolver'
import { SampleRepository } from 'src/modules/sample/repositories/sample.repository'
import { TypeormExModule } from 'src/typeorm-ex/typeorm-ex.module'

@Module({
  controllers: [],
  imports: [TypeormExModule.forCustomRepository([SampleRepository])],
  providers: [SampleService, SampleResolver],
})
export class SampleModule {}
