import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { Field, ID, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from '@/common/entities/base.entity'
import { TodoRepository } from '@/features/todo/repositories/todo.repository'

@Entity({
  repository: () => TodoRepository,
  tableName: 'todos',
})
@ObjectType()
export class TodoEntity extends BaseEntity {
  @Field()
  @Property({ default: false })
  completed!: boolean

  @Field(() => Date)
  declare createdAt: Date

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'text' })
  description?: string

  @Field(() => ID)
  declare id: number

  @Field()
  @Property()
  title!: string

  @Field(() => Date)
  declare updatedAt: Date
}
