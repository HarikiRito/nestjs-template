import { Injectable, Scope } from '@nestjs/common'
import { SampleEntity } from 'src/modules/sample/entities/sample.entity'
import DataLoader from 'dataloader'
import { buildIdDataLoader } from 'src/modules/common/dataloader/id.dataloader'
import { EntityManager } from '@mikro-orm/postgresql'

@Injectable({
  scope: Scope.REQUEST,
})
export class SampleDataloader {
  id: DataLoader<string, SampleEntity>

  constructor(private readonly em: EntityManager) {
    this.id = buildIdDataLoader(SampleEntity, em)
  }
}
