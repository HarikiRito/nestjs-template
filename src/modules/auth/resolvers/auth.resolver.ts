import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthEntity } from 'src/modules/auth/entities/auth.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { LoginInput } from 'src/modules/auth/dtos/auth.input'
import { UserEntity } from 'src/modules/user/entities/user.entity'
import { UserService } from 'src/modules/user/services/user.service'
import { AuthJwtMixed, CurrentUser, GraphQLContext } from 'src/modules/common/decorators/common.decorator'

@Resolver(() => AuthEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}
  @Query(() => UserEntity, {
    nullable: true,
  })
  @AuthJwtMixed()
  me(@CurrentUser() user: UserEntity, @Context() ctx: GraphQLContext) {
    return user
  }
  @Mutation(() => AuthEntity)
  async login(@Args('input') input: LoginInput, @Context() ctx: GraphQLContext) {
    const [user, auth] = await this.authService.loginByUsername(input)
    this.authService.saveTokenToCookie(ctx, auth)
    return auth
  }

  @Mutation(() => AuthEntity)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.renewAccessToken(refreshToken)
  }
}
