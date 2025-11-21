import { Injectable, NotFoundException } from '@nestjs/common'

import { TodoEntity } from '@/features/todo/entities/todo.entity'
import { CreateTodoInput } from '@/features/todo/inputs/createTodo.input'
import { UpdateTodoInput } from '@/features/todo/inputs/updateTodo.input'
import { TodoRepository } from '@/features/todo/repositories/todo.repository'
import { guardAsync } from '@/utils/safeData'

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  /**
   * Create a new todo
   *
   * @param createTodoInput - Todo creation data
   * @returns Created todo entity
   */
  async create(createTodoInput: CreateTodoInput): Promise<TodoEntity> {
    const result = await guardAsync(async () => {
      const em = this.todoRepository.getEntityManager()
      const todo = em.create(this.todoRepository.getEntityName(), {
        completed: createTodoInput.completed ?? false,
        description: createTodoInput.description,
        title: createTodoInput.title,
      })
      await em.persistAndFlush(todo)
      return todo
    })

    if (!result.hasData()) {
      throw new Error(`Failed to create todo: ${result.error}`)
    }

    return result.data as TodoEntity
  }

  /**
   * Find all todos with pagination and optional filtering
   *
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @param filter - Optional filter criteria (e.g., { completed: true })
   * @returns Paginated todos with metadata
   */
  async findAll(page = 1, limit = 20, filter?: { completed?: boolean }) {
    const where: Record<string, unknown> = {}

    if (filter?.completed !== undefined) {
      where.completed = filter.completed
    }

    const result = await guardAsync(async () =>
      this.todoRepository.paginate({
        limit,
        orderBy: { createdAt: 'DESC' },
        page,
        where,
      }),
    )

    if (!result.hasData()) {
      throw new Error(`Failed to fetch todos: ${result.error}`)
    }

    return result.data
  }

  /**
   * Find all completed todos
   *
   * @returns Array of completed todos
   */
  async findCompleted() {
    const result = await guardAsync(async () => this.todoRepository.findCompleted())

    if (!result.hasData()) {
      throw new Error(`Failed to fetch completed todos: ${result.error}`)
    }

    return result.data
  }

  /**
   * Find a single todo by ID
   *
   * @param id - Todo ID
   * @returns Todo entity
   * @throws NotFoundException if todo not found
   */
  async findOne(id: number) {
    const result = await guardAsync(async () => this.todoRepository.findOneOrThrow({ id }))

    if (!result.hasData()) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }

    return result.data
  }

  /**
   * Find all pending (not completed) todos
   *
   * @returns Array of pending todos
   */
  async findPending() {
    const result = await guardAsync(async () => this.todoRepository.findPending())

    if (!result.hasData()) {
      throw new Error(`Failed to fetch pending todos: ${result.error}`)
    }

    return result.data
  }

  /**
   * Delete a todo
   *
   * @param id - Todo ID
   * @throws NotFoundException if todo not found
   */
  async remove(id: number) {
    const result = await guardAsync(async () => {
      const todo = await this.todoRepository.findOneOrThrow({ id })
      await this.todoRepository.getEntityManager().removeAndFlush(todo)
      return todo
    })

    if (!result.hasData()) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }

    return result.data
  }

  /**
   * Update an existing todo
   *
   * @param id - Todo ID
   * @param updateTodoInput - Updated todo data
   * @returns Updated todo entity
   * @throws NotFoundException if todo not found
   */
  async update(id: number, updateTodoInput: UpdateTodoInput) {
    const result = await guardAsync(async () => {
      const todo = await this.todoRepository.findOneOrThrow({ id })

      // Apply updates
      if (updateTodoInput.title !== undefined) {
        todo.title = updateTodoInput.title
      }
      if (updateTodoInput.description !== undefined) {
        todo.description = updateTodoInput.description
      }
      if (updateTodoInput.completed !== undefined) {
        todo.completed = updateTodoInput.completed
      }

      await this.todoRepository.getEntityManager().flush()
      return todo
    })

    if (!result.hasData()) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }

    return result.data
  }
}
