import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { GraphQLContext } from 'src/modules/common/decorators/common.decorator'

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext()
    return ctx.req as any
  }
}
@Injectable()
export class GqlJwtCookieAuthGuard extends AuthGuard('cookie') {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext()
    return ctx.req as any
  }
}

@Injectable()
export class GqlJwtMixedAuthGuard extends AuthGuard('mixed') {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext()
    return ctx.req as any
  }
}
