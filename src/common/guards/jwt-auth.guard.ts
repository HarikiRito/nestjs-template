import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AppConfigService } from '@/config/config.service'
import { guardAsync } from '@/utils/safeData'

import { IS_AUTH_REQUIRED_KEY } from '../decorators/require-auth.decorator'

/**
 * JWT Authentication Guard for GraphQL and REST API
 *
 * This guard validates JWT tokens.
 * It checks if the @RequireAuth() decorator is present on resolvers/controllers.
 *
 * Features:
 * - Works with both GraphQL and REST API
 * - Extracts JWT token from Authorization header
 * - Validates token
 * - Attaches user object to request context
 * - Only activates on @RequireAuth() decorated resolvers/controllers
 *
 * @example
 * ```typescript
 * // In GraphQL resolver:
 * @RequireAuth()
 * @Query(() => String)
 * async secureData(@CurrentUser() user: AuthUser) {
 *   return `Hello ${user.email}`
 * }
 *
 * // In REST controller:
 * @RequireAuth()
 * @Get('me')
 * async getMe(@Req() req: { user: AuthUser }) {
 *   return req.user
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: AppConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if authentication is required for this resolver/controller
    const isAuthRequired = this.reflector.getAllAndOverride<boolean>(IS_AUTH_REQUIRED_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // If no @Auth() decorator, allow access
    if (!isAuthRequired) {
      return true
    }

    // Get request object (works for both GraphQL and REST)

    const request = this.getRequest(context)

    // Extract JWT token from Authorization header
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const authHeader = request.headers.authorization as string | undefined
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required')
    }

    // Expected format: "Bearer <token>"
    const [scheme, token] = authHeader.split(' ')
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format. Expected: "Bearer <token>"')
    }

    // Validate token
    const user = await this.validateToken(token)
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    // Attach user to request for @CurrentUser() decorator

    request.user = user

    return true
  }

  /**
   * Extract request object from execution context
   * Works for both GraphQL and REST API
   *
   * @param context - Execution context
   * @returns Request object
   */
  private getRequest(context: ExecutionContext): { headers: { authorization?: string }; user?: unknown } {
    const contextType = context.getType<string>()

    // GraphQL context
    if (contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return ctx.getContext().req
    }

    // REST API context (http)

    return context.switchToHttp().getRequest()
  }

  /**
   * Validate JWT token
   * TODO: Implement proper JWT validation with your auth provider
   *
   * @param token - JWT token to validate
   * @returns User object if valid, null if invalid
   */
  private async validateToken(token: string) {
    // TODO: Replace with your actual JWT validation logic
    // This is a placeholder implementation
    const result = await guardAsync(async () => {
      // Example: Decode and verify JWT token
      // const decoded = jwt.verify(token, this.config.jwtSecret);
      // return decoded as AuthUser;

      // Placeholder: Return mock user for now
      // Replace this with actual token validation
      if (!token) {
        return null
      }

      // Placeholder user - replace with actual decoded token data
      return {
        email: 'user@example.com',
        id: 1,
        name: 'User',
        role: 'user',
      }
    })

    return result.hasData() ? result.data : null
  }
}
