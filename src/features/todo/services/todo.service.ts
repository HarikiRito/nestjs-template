import { RequiredEntityData } from '@mikro-orm/core'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ResultAsync } from 'neverthrow'

import { TodoEntity } from '@/features/todo/entities/todo.entity'
import { CreateTodoInput } from '@/features/todo/inputs/createTodo.input'
import { UpdateTodoInput } from '@/features/todo/inputs/updateTodo.input'
import { TodoRepository } from '@/features/todo/repositories/todo.repository'
import { toError } from '@/utils/safeData'

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  /**
   * Create a new todo
   *
   * @param createTodoInput - Todo creation data
   * @returns Created todo entity
   */
  private async createTodo(createTodoInput: CreateTodoInput): Promise<TodoEntity> {
    const todo = this.todoRepository.create({
      completed: createTodoInput.completed ?? false,
      description: createTodoInput.description,
      title: createTodoInput.title,
    } as RequiredEntityData<TodoEntity>)
    await this.todoRepository.getEntityManager().persist(todo).flush()
    return todo
  }

  async create(createTodoInput: CreateTodoInput): Promise<TodoEntity> {
    const result = await ResultAsync.fromPromise(this.createTodo(createTodoInput), toError)

    if (result.isErr()) {
      throw new Error(`Failed to create todo: ${result.error}`, { cause: result.error })
    }

    return result.value
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

    const result = await ResultAsync.fromPromise(
      this.todoRepository.paginate({
        limit,
        orderBy: { createdAt: 'DESC' },
        page,
        where,
      }),
      toError,
    )

    if (result.isErr()) {
      throw new Error(`Failed to fetch todos: ${result.error}`, { cause: result.error })
    }

    return result.value
  }

  /**
   * Find all completed todos
   *
   * @returns Array of completed todos
   */
  async findCompleted() {
    const result = await ResultAsync.fromPromise(this.todoRepository.findCompleted(), toError)

    if (result.isErr()) {
      throw new Error(`Failed to fetch completed todos: ${result.error}`, { cause: result.error })
    }

    return result.value
  }

  /**
   * Find a single todo by ID
   *
   * @param id - Todo ID
   * @returns Todo entity
   * @throws NotFoundException if todo not found
   */
  async findOne(id: number) {
    const result = await ResultAsync.fromPromise(
      this.todoRepository.findOneOrThrow({ id }),
      toError,
    )

    if (result.isErr()) {
      throw new NotFoundException(`Todo with ID ${id} not found`, { cause: result.error })
    }

    return result.value
  }

  /**
   * Find all pending (not completed) todos
   *
   * @returns Array of pending todos
   */
  async findPending() {
    const result = await ResultAsync.fromPromise(this.todoRepository.findPending(), toError)

    if (result.isErr()) {
      throw new Error(`Failed to fetch pending todos: ${result.error}`, { cause: result.error })
    }

    return result.value
  }

  /**
   * Delete a todo
   *
   * @param id - Todo ID
   * @throws NotFoundException if todo not found
   */
  private async removeTodo(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOneOrThrow({ id })
    await this.todoRepository.getEntityManager().remove(todo).flush()
    return todo
  }

  async remove(id: number) {
    const result = await ResultAsync.fromPromise(this.removeTodo(id), toError)

    if (result.isErr()) {
      throw new NotFoundException(`Todo with ID ${id} not found`, { cause: result.error })
    }

    return result.value
  }

  /**
   * Update an existing todo
   *
   * @param id - Todo ID
   * @param updateTodoInput - Updated todo data
   * @returns Updated todo entity
   * @throws NotFoundException if todo not found
   */
  private async updateTodo(id: number, updateTodoInput: UpdateTodoInput): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOneOrThrow({ id })
    if (updateTodoInput.title !== undefined) todo.title = updateTodoInput.title
    if (updateTodoInput.description !== undefined) todo.description = updateTodoInput.description
    if (updateTodoInput.completed !== undefined) todo.completed = updateTodoInput.completed
    await this.todoRepository.getEntityManager().flush()
    return todo
  }

  async update(id: number, updateTodoInput: UpdateTodoInput) {
    const result = await ResultAsync.fromPromise(this.updateTodo(id, updateTodoInput), toError)

    if (result.isErr()) {
      throw new NotFoundException(`Todo with ID ${id} not found`, { cause: result.error })
    }

    return result.value
  }
}
