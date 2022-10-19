import { Module } from '@nestjs/common';
import { SampleController } from 'src/modules/sample/controllers/sample.controller';
import { SampleService } from 'src/modules/sample/services/sample.service';
import { SampleResolver } from 'src/modules/sample/resolvers/sample.resolver';

@Module({
  controllers: [SampleController],
  providers: [SampleService, SampleResolver],
})
export class SampleModule {}
