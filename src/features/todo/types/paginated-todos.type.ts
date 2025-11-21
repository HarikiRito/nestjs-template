import { Field, Int, ObjectType } from '@nestjs/graphql'

import { TodoEntity } from '@/features/todo/entities/todo.entity'

/**
 * Paginated Todos response type for GraphQL
 */
@ObjectType()
export class PaginatedTodos {
  @Field()
  hasNextPage!: boolean

  @Field()
  hasPreviousPage!: boolean

  @Field(() => [TodoEntity])
  items!: TodoEntity[]

  @Field(() => Int)
  limit!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  totalPages!: number
}
