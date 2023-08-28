import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/modules/auth/entities/auth.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { LoginInput } from 'src/modules/auth/dtos/auth.input'
import { User } from 'src/modules/user/entities/user.entity'
import { UserService } from 'src/modules/user/services/user.service'
import { AuthJwtMixed, CurrentUser, GraphQLContext } from 'src/modules/common/decorators/common.decorator'

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Query(() => User, {
    nullable: true,
  })
  @AuthJwtMixed()
  me(@CurrentUser() user: User, @Context() ctx: GraphQLContext) {
    return user
  }
  @Mutation(() => Auth)
  async login(@Args('input') input: LoginInput, @Context() ctx: GraphQLContext) {
    const [user, auth] = await this.authService.loginByUsername(input)
    this.authService.saveTokenToCookie(ctx, auth)
    return auth
  }

  @Mutation(() => Auth)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.renewAccessToken(refreshToken)
  }
}
