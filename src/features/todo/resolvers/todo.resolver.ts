import { Injectable } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { TodoEntity } from '@/features/todo/entities/todo.entity'
import { CreateTodoInput } from '@/features/todo/inputs/createTodo.input'
import { TodoQueryArgs } from '@/features/todo/inputs/todoQuery.args'
import { UpdateTodoInput } from '@/features/todo/inputs/updateTodo.input'
import { TodoService } from '@/features/todo/services/todo.service'
import { PaginatedTodos } from '@/features/todo/types/paginated-todos.type'

/**
 * GraphQL resolver for Todo operations
 * Handles queries and mutations by delegating to TodoService
 */
@Injectable()
@Resolver(() => TodoEntity)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  /**
   * Mutation: Create a new todo
   */
  @Mutation(() => TodoEntity)
  async createTodo(@Args('input') input: CreateTodoInput): Promise<TodoEntity> {
    return this.todoService.create(input)
  }

  /**
   * Mutation: Delete a todo by ID
   */
  @Mutation(() => TodoEntity)
  async deleteTodo(@Args('id', { type: () => Int }) id: number): Promise<TodoEntity> {
    return this.todoService.remove(id)
  }

  /**
   * Query: Get a single todo by ID
   */
  @Query(() => TodoEntity, { nullable: true })
  async todo(@Args('id', { type: () => Int }) id: number): Promise<null | TodoEntity> {
    return this.todoService.findOne(id)
  }

  /**
   * Query: Get paginated list of todos with optional filtering
   * Examples:
   * - All todos: todos(page: 1, limit: 20)
   * - Completed: todos(filter: { completed: true })
   * - Pending: todos(filter: { completed: false })
   */
  @Query(() => PaginatedTodos)
  async todos(@Args() args: TodoQueryArgs): Promise<PaginatedTodos> {
    return this.todoService.findAll(args.page, args.limit, args.filter)
  }

  /**
   * Mutation: Update a todo
   */
  @Mutation(() => TodoEntity)
  async updateTodo(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateTodoInput,
  ): Promise<TodoEntity> {
    return this.todoService.update(id, input)
  }
}
