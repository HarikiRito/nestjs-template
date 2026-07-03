import { Field, ObjectType } from '@nestjs/graphql'

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

  @Field()
  id!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  role?: string

  @Field()
  updatedAt!: string
}
