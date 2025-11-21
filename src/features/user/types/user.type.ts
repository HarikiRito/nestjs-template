import { Field, Int, ObjectType } from '@nestjs/graphql'

/**
 * User GraphQL Type
 *
 * Represents user information from authentication
 */
@ObjectType('User')
export class UserType {
  @Field()
  createdAt!: string

  @Field()
  email!: string

  @Field(() => Int)
  id!: number

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  role?: string

  @Field()
  updatedAt!: string
}
