import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard, GqlJwtCookieAuthGuard } from 'src/modules/auth/guards/jwt.guard'
import { GraphQLExecutionContext } from '@nestjs/graphql'
import { GraphQLResolveInfo } from 'graphql/type'
import { Request, Response } from 'express'
export interface GraphQLContext {
  req: Request
  res: Response
}
type _ExecutionContext = [unknown, unknown, GraphQLContext, GraphQLResolveInfo]
export const CurrentUser = createParamDecorator<string, GraphQLExecutionContext, any>((_data, host) => {
  const [, , ctx] = host.getArgs<_ExecutionContext>()
  return ctx?.req?.user
})

export function AuthJwt() {
  return applyDecorators(UseGuards(GqlJwtAuthGuard))
}

export function AuthJwtCookie() {
  return applyDecorators(UseGuards(GqlJwtCookieAuthGuard))
}
