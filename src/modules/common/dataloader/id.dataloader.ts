import DataLoader from 'dataloader'
import { Type } from '@nestjs/common'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { EntityManager } from '@mikro-orm/postgresql'

export function buildIdDataLoader<T extends CommonEntity>(entityClass: Type<T>, em: EntityManager) {
  return new DataLoader<string, T>(async (ids: ReadonlyArray<string>) => {
    const rows = await em.fork().find(entityClass, {
      id: {
        $in: [...ids],
      },
    })
    return ids.map((id) => rows.find((x) => x.id === id) ?? new Error('Not found'))
  })
}
