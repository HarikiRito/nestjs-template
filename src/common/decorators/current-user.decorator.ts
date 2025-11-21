import type { ExecutionContext } from '@nestjs/common'

import { createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

/**
 * User object structure from authentication
 */
export interface AuthUser {
  email: string
  id: number
  name?: string
  role?: string
}

/**
 * Decorator to extract current authenticated user from GraphQL context
 *
 * Usage:
 * ```typescript
 * @RequireAuth()
 * @Query(() => TodoEntity)
 * async myTodos(@CurrentUser() user: AuthUser) {
 *   return this.todoService.findByUser(user.id)
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const ctx = GqlExecutionContext.create(context)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const request = ctx.getContext().req
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request.user
  },
)
