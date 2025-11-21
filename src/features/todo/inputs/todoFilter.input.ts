import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'

/**
 * Input type for filtering todos
 * Used in the todos query to filter results by specific criteria
 */
@InputType()
export class TodoFilterInput {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean
}
