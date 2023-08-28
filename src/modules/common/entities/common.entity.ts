import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Property } from '@mikro-orm/core'
import { snowflake } from '../../../utils/common'

@ObjectType()
export class CommonEntity {
  @Field(() => ID)
  @Property({
    type: 'bigint',
    primary: true,
    unsigned: true,
  })
  id: string

  @Property({ type: 'date' })
  createdAt: Date = new Date()

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property({ nullable: true })
  deletedAt?: Date

  constructor() {
    this.id = snowflake.nextId()
  }
}
