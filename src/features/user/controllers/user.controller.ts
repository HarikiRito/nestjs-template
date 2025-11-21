import { Controller, Get, Req } from '@nestjs/common'

import { AuthUser } from '@/common/decorators/current-user.decorator'
import { Auth } from '@/common/decorators/require-auth.decorator'

/**
 * User REST API Controller
 *
 * Provides REST endpoints for user information
 */
@Controller('users')
export class UserController {
  @Auth()
  @Get('me')
  async getCurrentUser(@Req() req: { user: AuthUser }) {
    return {
      createdAt: new Date().toISOString(),
      email: req.user.email,
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
      updatedAt: new Date().toISOString(),
    }
  }
}
