import type { EntityManager } from '@mikro-orm/core'

import { BaseRepository } from '@/common/repositories/base.repository'
import { TodoEntity } from '@/features/todo/entities/todo.entity'

export class TodoRepository extends BaseRepository<TodoEntity> {
  constructor(em: EntityManager) {
    super(em, TodoEntity)
  }

  async findCompleted(): Promise<TodoEntity[]> {
    return this.find({ completed: true }, { orderBy: { updatedAt: 'DESC' } })
  }

  /**
   * Find all pending todos
   *
   * Returns todos where completed = false, ordered by creation date (oldest first).
   *
   * @returns Array of pending todos
   */
  async findPending(): Promise<TodoEntity[]> {
    return this.find({ completed: false }, { orderBy: { createdAt: 'ASC' } })
  }

  /**
   * Mark a todo as completed
   *
   * Updates the completed field to true and flushes changes to database.
   *
   * @param id - Todo ID
   * @returns Updated todo entity
   * @throws Error if todo not found
   */
  async markCompleted(id: number): Promise<TodoEntity> {
    const todo = await this.findOneOrFail({ id })
    todo.completed = true
    await this.em.flush()
    return todo
  }

  /**
   * Mark a todo as pending (not completed)
   *
   * Updates the completed field to false and flushes changes to database.
   *
   * @param id - Todo ID
   * @returns Updated todo entity
   * @throws Error if todo not found
   */
  async markPending(id: number): Promise<TodoEntity> {
    const todo = await this.findOneOrFail({ id })
    todo.completed = false
    await this.em.flush()
    return todo
  }
}
