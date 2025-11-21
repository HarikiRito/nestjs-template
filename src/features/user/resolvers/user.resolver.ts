import { Injectable } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { AuthUser, CurrentUser } from '@/common/decorators/current-user.decorator'
import { Auth } from '@/common/decorators/require-auth.decorator'

import { UserType } from '../types/user.type'

/**
 * GraphQL resolver for User operations
 *
 * Provides queries for retrieving user information
 */
@Injectable()
@Resolver(() => UserType)
export class UserResolver {
  @Auth()
  @Query(() => UserType, {
    description: 'Get current authenticated user information',
  })
  async me(@CurrentUser() user: AuthUser): Promise<UserType> {
    // User is already validated by JwtAuthGuard
    // Return the user data with proper typing
    return {
      createdAt: new Date().toISOString(),
      email: user.email,
      id: user.id,
      name: user.name,
      role: user.role,
      updatedAt: new Date().toISOString(),
    }
  }
}
