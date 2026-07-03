import type { ExecutionContext } from '@nestjs/common'

import { createParamDecorator } from '@nestjs/common'

import { getGqlRequest } from '@/common/utils/gql-context'

export interface AuthUser {
  email: string
  id: string
  name?: string
  role?: string
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    return getGqlRequest(context).user as AuthUser
  },
)
