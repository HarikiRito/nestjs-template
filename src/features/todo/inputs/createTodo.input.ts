import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

/**
 * Input type for creating a new Todo
 * Uses GraphQL @InputType decorator with class-validator validation
 */
@InputType()
export class CreateTodoInput {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @Field()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  title!: string
}
