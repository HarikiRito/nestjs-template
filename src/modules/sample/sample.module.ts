import { Module } from '@nestjs/common'
import { SampleService } from 'src/modules/sample/services/sample.service'
import { SampleResolver } from 'src/modules/sample/resolvers/sample.resolver'
import { OrmModule } from 'src/modules/orm/orm.module'

@Module({
  imports: [OrmModule],
  providers: [SampleService, SampleResolver],
  exports: [SampleService],
})
export class SampleModule {}
