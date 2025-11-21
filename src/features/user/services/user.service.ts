import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AppConfigService } from '@/config/config.service'
import { guardAsync } from '@/utils/safeData'

import { UserType } from '../types/user.type'

/**
 * User Service
 *
 * Handles user-related operations
 */
@Injectable()
export class UserService {
  constructor(private readonly config: AppConfigService) {}

  /**
   * Get current user information using JWT token
   * TODO: Implement proper user lookup from your database or auth provider
   *
   * @param token - JWT token from Authorization header
   * @returns User information
   * @throws UnauthorizedException if token is invalid
   */
  async getCurrentUser(token: string): Promise<UserType> {
    const result = await guardAsync(async () => {
      // TODO: Replace with actual user lookup logic
      // This is a placeholder implementation

      if (!token) {
        throw new UnauthorizedException('Invalid or expired token')
      }

      // Placeholder user - replace with actual database lookup or JWT decode
      return {
        createdAt: new Date().toISOString(),
        email: 'user@example.com',
        id: 1,
        name: 'User',
        role: 'user',
        updatedAt: new Date().toISOString(),
      }
    })

    if (!result.hasData()) {
      throw new UnauthorizedException('Failed to authenticate')
    }

    return result.data
  }
}
