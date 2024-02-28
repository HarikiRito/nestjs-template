import { Injectable } from '@nestjs/common'
import { EntityManager, FilterQuery } from '@mikro-orm/core'
import { SampleEntity } from 'src/modules/sample/entities/sample.entity'

@Injectable()
export class SampleService {
  constructor(private readonly em: EntityManager) {}

  async findWhere(where?: FilterQuery<SampleEntity>) {
    return this.em.find(SampleEntity, where || {})
  }
}
