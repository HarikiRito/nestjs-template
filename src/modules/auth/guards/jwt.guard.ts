import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { GraphQLContext } from 'src/modules/common/decorators/common.decorator'
import { Anything } from '../../../types/common'
export enum AuthGuardType {
  Jwt = 'jwt',
  Cookie = 'cookie',
  Mixed = 'mixed',
  WebsocketJwt = 'websocket-jwt',
}
@Injectable()
export class GqlJwtAuthGuard extends AuthGuard(AuthGuardType.Jwt) {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext()
    return ctx.req as Anything
  }
}
@Injectable()
export class GqlJwtCookieAuthGuard extends AuthGuard(AuthGuardType.Cookie) {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext()
    return ctx.req as Anything
  }
}

@Injectable()
export class GqlJwtMixedAuthGuard extends AuthGuard(AuthGuardType.Mixed) {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext()
    return ctx.req as Anything
  }
}
