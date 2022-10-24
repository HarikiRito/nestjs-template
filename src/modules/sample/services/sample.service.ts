import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SampleEntity } from 'src/modules/sample/entities/sample.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SampleService {
  constructor(
    @InjectRepository(SampleEntity)
    private readonly sampleRepo: Repository<SampleEntity>,
  ) {}

  async findOne() {
    return this.sampleRepo.find()
  }
}
