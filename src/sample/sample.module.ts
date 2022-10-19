import { Module } from '@nestjs/common';
import { SampleController } from 'src/sample/controllers/sample.controller';
import { SampleService } from 'src/sample/services/sample.service';

@Module({
  controllers: [SampleController],
  providers: [SampleService],
})
export class SampleModule {}
