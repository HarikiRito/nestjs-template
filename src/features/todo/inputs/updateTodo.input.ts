import { InputType, PartialType } from '@nestjs/graphql'

import { CreateTodoInput } from '@/features/todo/inputs/createTodo.input'

/**
 * Input type for updating a Todo
 * Extends CreateTodoInput with all fields made optional via PartialType
 */
@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {}
