import type { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/core'

import { EntityRepository } from '@mikro-orm/core'

import type { BaseEntity } from '@/common/entities/base.entity'

/**
 * Pagination options
 */
export interface PaginationOptions<T> {
  limit?: number
  orderBy?: FindOptions<T>['orderBy']
  page?: number
  where?: FilterQuery<T>
}

/**
 * Pagination result type
 */
export interface PaginationResult<T> {
  hasNextPage: boolean
  hasPreviousPage: boolean
  items: T[]
  limit: number
  page: number
  total: number
  totalPages: number
}

/**
 * Base Repository
 *
 * Abstract repository providing common query helpers for all entities.
 * Extends MikroORM's EntityRepository and adds useful methods like
 * pagination and safe findOne operations.
 *
 * **Why extend this:**
 * - Reusable pagination logic across all repositories
 * - Type-safe query helpers
 * - Consistent error handling (findOneOrFail)
 * - Reduces boilerplate in concrete repositories
 *
 * **Usage:**
 * ```typescript
 * export class TodoRepository extends BaseRepository<TodoEntity> {
 *   constructor(em: EntityManager) {
 *     super(em, TodoEntity)
 *   }
 *
 *   // Custom methods here
 *   async findByTitle(title: string) {
 *     return this.find({ title })
 *   }
 * }
 * ```
 *
 * @template T - Entity type that extends BaseEntity
 */
export abstract class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  constructor(
    protected override readonly em: EntityManager,
    protected readonly entityClass: new () => T,
  ) {
    super(em, entityClass)
  }

  /**
   * Find one entity or throw an error if not found
   *
   * Unlike the standard `findOne` which returns null if not found,
   * this method throws an error. Useful for operations where the
   * entity must exist (e.g., update, delete).
   *
   * @param where - Filter conditions
   * @returns The found entity
   * @throws Error if entity not found
   *
   * @example
   * ```typescript
   * // Will throw if todo #123 doesn't exist
   * const todo = await todoRepo.findOneOrThrow({ id: 123 })
   * ```
   */
  async findOneOrThrow(where: FilterQuery<T>): Promise<T> {
    const item = await this.findOne(where)

    if (!item) {
      // Use entity class constructor name instead of entityName symbol
      const entityClassName = this.entityClass.name
      throw new Error(`${entityClassName} not found`)
    }

    return item
  }

  /**
   * Paginate query results with metadata
   *
   * Returns a page of results along with pagination metadata like total count,
   * current page, and total pages. Useful for building paginated APIs.
   *
   * @param options - Pagination configuration
   * @param options.page - Page number (1-indexed, default: 1)
   * @param options.limit - Items per page (default: 20)
   * @param options.where - Filter conditions
   * @param options.orderBy - Sort order
   * @returns Paginated results with metadata
   *
   * @example
   * ```typescript
   * const result = await todoRepo.paginate({
   *   page: 2,
   *   limit: 10,
   *   where: { completed: false },
   *   orderBy: { createdAt: 'DESC' }
   * })
   *
   * console.log(result.items)      // Array of 10 todos
   * console.log(result.total)      // Total count (all pages)
   * console.log(result.page)       // 2
   * console.log(result.totalPages) // e.g., 5
   * ```
   */
  async paginate(options: PaginationOptions<T> = {}): Promise<PaginationResult<T>> {
    const page = options.page ?? 1
    const limit = options.limit ?? 20
    const offset = (page - 1) * limit

    const [items, total] = await this.findAndCount(options.where ?? ({} as FilterQuery<T>), {
      limit,
      offset,
      orderBy: options.orderBy,
    })

    const totalPages = Math.ceil(total / limit)

    return {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      items,
      limit,
      page,
      total,
      totalPages,
    }
  }
}
