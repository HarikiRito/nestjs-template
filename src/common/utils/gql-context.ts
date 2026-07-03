import type { ExecutionContext } from '@nestjs/common'

import { GqlExecutionContext } from '@nestjs/graphql'

export interface GqlRequest {
  headers: { authorization?: string }
  user?: unknown
}

export function getGqlRequest(context: ExecutionContext): GqlRequest {
  return GqlExecutionContext.create(context).getContext<{ req: GqlRequest }>().req
}
