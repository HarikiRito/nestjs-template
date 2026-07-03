import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { Auth } from '@/common/decorators/require-auth.decorator'

import { AuthService } from '../services/auth.service'
import { AuthResponse } from '../types/auth-response.type'
import { LoginInput } from '../dto/login.input'
import { LogoutInput } from '../dto/logout.input'
import { RefreshTokenInput } from '../dto/refresh-token.input'
import { SignupInput } from '../dto/signup.input'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(@Args('input') input: SignupInput): Promise<AuthResponse> {
    return this.authService.signup(input)
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input)
  }

  @Mutation(() => AuthResponse)
  async refreshToken(@Args('input') input: RefreshTokenInput): Promise<AuthResponse> {
    return this.authService.refreshToken(input.refreshToken)
  }

  @Auth()
  @Mutation(() => Boolean)
  async logout(
    @Args('input') input: LogoutInput,
    @Context() context: { req: { headers: { authorization?: string } } },
  ): Promise<boolean> {
    const authHeader = context.req.headers.authorization ?? ''
    const accessToken = authHeader.replace('Bearer ', '')
    return this.authService.logout(accessToken, input.refreshToken)
  }
}
