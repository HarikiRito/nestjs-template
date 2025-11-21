import { SetMetadata } from '@nestjs/common'

/**
 * Metadata key for authentication requirement
 */
export const IS_AUTH_REQUIRED_KEY = 'isAuthRequired'

/**
 * Decorator to mark GraphQL resolvers that require authentication
 *
 * Usage:
 * ```typescript
 * @RequireAuth()
 * @Query(() => TodoEntity)
 * async secureTodo(@Args('id') id: number) {
 *   return this.todoService.findOne(id)
 * }
 * ```
 */
export const Auth = () => SetMetadata(IS_AUTH_REQUIRED_KEY, true)
