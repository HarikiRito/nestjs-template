import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthEntity } from 'src/modules/auth/entities/auth.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { LoginInput } from 'src/modules/auth/dtos/auth.input'
import { UserEntity } from 'src/modules/user/entities/user.entity'

@Resolver(() => AuthEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserEntity)
  async login(@Args('input') input: LoginInput) {
    return this.authService.validateUser(input.username, input.password)
  }
}
