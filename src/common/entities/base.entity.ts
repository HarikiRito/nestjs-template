import { PrimaryKey, Property } from '@mikro-orm/core'

export abstract class BaseEntity {
  @Property({ onCreate: () => new Date() })
  createdAt!: Date

  @PrimaryKey()
  id!: number

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date
}
