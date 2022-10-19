import { Module } from '@nestjs/common';
import { SampleController } from 'src/sample/controllers/sample.controller';
import { SampleService } from 'src/sample/services/sample.service';
import { SampleResolver } from 'src/sample/resolvers/sample.resolver';

@Module({
  controllers: [SampleController],
  providers: [SampleService, SampleResolver],
})
export class SampleModule {}
