import { Args, Query, Resolver } from '@nestjs/graphql'
import { AuthEntity } from 'src/modules/auth/entities/auth.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'

@Resolver(() => AuthEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => [AuthEntity])
  async auth(@Args('id') id: number) {
    return this.authService.findOne()
  }
}
