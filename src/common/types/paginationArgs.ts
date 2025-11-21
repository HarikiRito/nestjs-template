import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

/**
 * Generic pagination arguments for GraphQL queries
 * Enforces min/max limits to prevent excessive data fetching
 * Reusable across all features
 */
@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 20 })
  @IsInt()
  @IsOptional()
  @Max(100)
  @Min(1)
  limit = 20

  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  page = 1
}
