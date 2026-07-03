import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Cache } from 'cache-manager'

import { GqlRequest, getGqlRequest } from '@/common/utils/gql-context'
import { AUTH_CACHE_KEYS, isTokenBlacklisted } from '@/features/auth/constants/auth.constants'
import type { JwtPayload } from '@/features/auth/services/auth.service'

import { IS_AUTH_REQUIRED_KEY } from '../decorators/require-auth.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthRequired = this.reflector.getAllAndOverride<boolean>(IS_AUTH_REQUIRED_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!isAuthRequired) {
      return true
    }

    const request = this.getRequest(context)

    const authHeader = request.headers.authorization
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required')
    }

    const [scheme, token] = authHeader.split(' ', 2)
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format. Expected: "Bearer <token>"')
    }

    const user = await this.validateToken(token)
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    request.user = user

    return true
  }

  private getRequest(context: ExecutionContext): GqlRequest {
    if (context.getType<string>() === 'graphql') {
      return getGqlRequest(context)
    }
    return context.switchToHttp().getRequest<GqlRequest>()
  }

  private async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token)
      if (decoded.type !== 'access') return null
      const blacklisted = await isTokenBlacklisted(this.cache, decoded.jti)
      if (blacklisted) return null
      return { id: decoded.sub, email: decoded.email }
    } catch {
      return null
    }
  }
}
