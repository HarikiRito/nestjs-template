import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy'

export abstract class BaseEntity {
  @Property({ onCreate: () => new Date(), type: 'datetime' })
  createdAt!: Date

  @PrimaryKey({ type: 'integer' })
  id!: number

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date(), type: 'datetime' })
  updatedAt!: Date
}
