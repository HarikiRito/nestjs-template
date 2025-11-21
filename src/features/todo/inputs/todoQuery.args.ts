import { ArgsType, Field } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'

import { PaginationArgs } from '@/common/types/paginationArgs'
import { TodoFilterInput } from '@/features/todo/inputs/todoFilter.input'

/**
 * Arguments for querying todos with pagination and filtering
 * Combines generic pagination with todo-specific filters
 */
@ArgsType()
export class TodoQueryArgs extends PaginationArgs {
  @Field(() => TodoFilterInput, { nullable: true })
  @IsOptional()
  @Type(() => TodoFilterInput)
  @ValidateNested()
  filter?: TodoFilterInput
}
