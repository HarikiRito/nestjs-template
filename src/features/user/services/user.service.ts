import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ResultAsync } from 'neverthrow'

import { toError } from '@/utils/safeData'

import { UserType } from '../types/user.type'

/**
 * User Service
 *
 * Handles user-related operations
 */
@Injectable()
export class UserService {
  /**
   * Get current user information using JWT token
   * TODO: Implement proper user lookup from your database or auth provider
   *
   * @param token - JWT token from Authorization header
   * @returns User information
   * @throws UnauthorizedException if token is invalid
   */
  private async fetchCurrentUser(token: string): Promise<UserType> {
    // TODO: Replace with actual user lookup logic
    // This is a placeholder implementation

    if (!token) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    // Placeholder user - replace with actual database lookup or JWT decode
    return {
      createdAt: new Date().toISOString(),
      email: 'user@example.com',
      id: '1',
      name: 'User',
      role: 'user',
      updatedAt: new Date().toISOString(),
    }
  }

  async getCurrentUser(token: string): Promise<UserType> {
    const result = await ResultAsync.fromPromise(this.fetchCurrentUser(token), toError)

    if (result.isErr()) {
      throw new UnauthorizedException('Failed to authenticate', { cause: result.error })
    }

    return result.value
  }
}
