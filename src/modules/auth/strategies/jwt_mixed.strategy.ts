import { ExtractJwt } from 'passport-jwt'
import { Strategy } from 'passport-custom'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/modules/user/services/user.service'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { JwtSubject } from 'src/modules/auth/jwt.constant'
import { JwtPayloadWithOption } from 'src/modules/auth/auth.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtMixedStrategy extends PassportStrategy(Strategy, 'mixed') {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    super()
  }

  async validate(req: Request) {
    try {
      const payload = await this.validateByRequest(req)
      return this.userService.findById(payload.id)
    } catch (err) {
      throw new UnauthorizedException()
    }
  }

  private async validateByRequest(req: Request) {
    // Decode token from cookies or from header
    const accessToken = this.getTokenByCookies(req.cookies) ?? this.getTokenByHeader(req)
    const payload = this.jwtService.decode(accessToken) as JwtPayloadWithOption | null

    if (!payload) throw new UnauthorizedException()

    const authEntity = await this.authService.getAuthEntityByAccessToken(accessToken)

    if (!authEntity) {
      throw new UnauthorizedException()
    }

    return payload
  }

  private getTokenByCookies(cookies: Record<string, string>) {
    return cookies[JwtSubject.AccessToken]
  }

  private getTokenByHeader(req: Request) {
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req)
  }
}
