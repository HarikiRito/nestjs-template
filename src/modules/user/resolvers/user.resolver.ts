import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from 'src/modules/user/entities/user.entity'
import { UserService } from 'src/modules/user/services/user.service'
import { CreateUserInput } from 'src/modules/user/dtos/user.input'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!'
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input)
  }
}
