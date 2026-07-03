import type { EntityManager } from '@mikro-orm/core'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TodoRepository } from './todo.repository'

describe('TodoRepository', () => {
  let repository: TodoRepository
  let em: { flush: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    em = { flush: vi.fn() }
    repository = new TodoRepository(em as unknown as EntityManager)
  })

  describe('markCompleted', () => {
    it('sets completed to true and flushes for a valid todo', async () => {
      const todo = { id: 1, completed: false }
      vi.spyOn(repository, 'findOneOrThrow').mockResolvedValue(todo as never)

      const result = await repository.markCompleted(1)

      expect(repository.findOneOrThrow).toHaveBeenCalledWith({ id: 1 })
      expect(todo.completed).toBe(true)
      expect(em.flush).toHaveBeenCalledOnce()
      expect(result).toBe(todo)
    })
  })

  describe('markPending', () => {
    it('sets completed to false and flushes for a valid todo', async () => {
      const todo = { id: 1, completed: true }
      vi.spyOn(repository, 'findOneOrThrow').mockResolvedValue(todo as never)

      const result = await repository.markPending(1)

      expect(repository.findOneOrThrow).toHaveBeenCalledWith({ id: 1 })
      expect(todo.completed).toBe(false)
      expect(em.flush).toHaveBeenCalledOnce()
      expect(result).toBe(todo)
    })
  })
})
