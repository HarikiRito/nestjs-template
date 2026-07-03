import { Type } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'

/**
 * Interface for paginated response structure
 */
export interface PaginatedResponse<T> {
  hasNextPage: boolean
  hasPreviousPage: boolean
  items: T[]
  limit: number
  page: number
  total: number
  totalPages: number
}

/**
 * Generic paginated response type for GraphQL queries
 * Matches the structure returned by BaseRepository.paginate()
 *
 * @example
 * ```typescript
 * // In your resolver:
 * @Query(() => Paginated(TodoEntity))
 * async todos(): Promise<PaginationResult<TodoEntity>> {
 *   return this.todoService.findAll()
 * }
 * ```
 */
export function Paginated<T>(classRef: Type<T>): Type<PaginatedResponse<T>> {
  @ObjectType(`Paginated${classRef.name}`)
  class PaginatedType implements PaginatedResponse<T> {
    @Field()
    hasNextPage!: boolean

    @Field()
    hasPreviousPage!: boolean

    @Field(() => [classRef])
    items!: T[]

    @Field(() => Int)
    limit!: number

    @Field(() => Int)
    page!: number

    @Field(() => Int)
    total!: number

    @Field(() => Int)
    totalPages!: number
  }

  return PaginatedType
}
