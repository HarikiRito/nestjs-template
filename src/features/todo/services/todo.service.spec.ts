import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TodoRepository } from '@/features/todo/repositories/todo.repository'

import { TodoService } from './todo.service'

describe('TodoService', () => {
  let service: TodoService
  let em: { flush: ReturnType<typeof vi.fn> }
  let todoRepository: {
    findOneOrThrow: ReturnType<typeof vi.fn>
    getEntityManager: ReturnType<typeof vi.fn>
  }

  beforeEach(async () => {
    em = { flush: vi.fn() }
    todoRepository = {
      findOneOrThrow: vi.fn(),
      getEntityManager: vi.fn().mockReturnValue(em),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService, { provide: TodoRepository, useValue: todoRepository }],
    }).compile()

    service = module.get(TodoService)
  })

  describe('update', () => {
    it('updates the todo fields and flushes for a valid id', async () => {
      const todo = { id: 1, title: 'old', description: 'old desc', completed: false }
      todoRepository.findOneOrThrow.mockResolvedValue(todo)

      const result = await service.update(1, {
        title: 'new',
        description: 'new desc',
        completed: true,
      })

      expect(todoRepository.findOneOrThrow).toHaveBeenCalledWith({ id: 1 })
      expect(todo.title).toBe('new')
      expect(todo.description).toBe('new desc')
      expect(todo.completed).toBe(true)
      expect(em.flush).toHaveBeenCalledOnce()
      expect(result).toBe(todo)
    })

    it('only updates the provided fields and leaves omitted fields unchanged', async () => {
      const todo = { id: 1, title: 'old', description: 'old desc', completed: false }
      todoRepository.findOneOrThrow.mockResolvedValue(todo)

      const result = await service.update(1, {
        title: 'new',
      })

      expect(todoRepository.findOneOrThrow).toHaveBeenCalledWith({ id: 1 })
      expect(todo.title).toBe('new')
      expect(todo.description).toBe('old desc')
      expect(todo.completed).toBe(false)
      expect(em.flush).toHaveBeenCalledOnce()
      expect(result).toBe(todo)
    })

    it('flips completed from true to false', async () => {
      const todo = { id: 1, title: 'old', description: 'old desc', completed: true }
      todoRepository.findOneOrThrow.mockResolvedValue(todo)

      const result = await service.update(1, {
        completed: false,
      })

      expect(todoRepository.findOneOrThrow).toHaveBeenCalledWith({ id: 1 })
      expect(todo.completed).toBe(false)
      expect(em.flush).toHaveBeenCalledOnce()
      expect(result).toBe(todo)
    })
  })
})
