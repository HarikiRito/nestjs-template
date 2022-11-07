import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext, GqlContextType } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { GraphQLContext } from 'src/modules/common/decorators/common.decorator'

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext()
    return ctx.req
  }
}
@Injectable()
export class GqlJwtCookieAuthGuard extends AuthGuard('cookie') {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext()
    return ctx.req
  }
}
