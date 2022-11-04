import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthEntity } from 'src/modules/auth/entities/auth.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { LoginInput } from 'src/modules/auth/dtos/auth.input'
import { UserEntity } from 'src/modules/user/entities/user.entity'
import { UserService } from 'src/modules/user/services/user.service'
import { AuthJwt, CurrentUser } from 'src/modules/common/decorators/common.decorator'

@Resolver(() => AuthEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}
  @Query(() => UserEntity, {
    nullable: true,
  })
  @AuthJwt()
  me(@CurrentUser() user: UserEntity) {
    return user
  }
  @Mutation(() => UserEntity)
  async login(@Args('input') input: LoginInput) {
    return this.authService.loginByUsername(input)
  }
}
