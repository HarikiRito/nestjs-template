import { Injectable } from '@nestjs/common'
import { SampleRepository } from 'src/modules/sample/repositories/sample.repository'

@Injectable()
export class SampleService {
  constructor(private readonly sampleRepo: SampleRepository) {}

  async findOne() {
    return this.sampleRepo.find()
  }
}
