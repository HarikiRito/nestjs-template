import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { jwtSecretKey, JwtSubject } from 'src/modules/auth/jwt.constant'
import { Request } from 'express'
import { AuthGuardType } from 'src/modules/auth/guards/jwt.guard'
import { JwtPayloadWithOption } from 'src/modules/auth/auth.interface'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from 'src/modules/auth/services/auth.service'

@Injectable()
export class JwtMixedStrategy extends PassportStrategy(Strategy, AuthGuardType.Mixed) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return this.getTokenByCookies(req.cookies) ?? ExtractJwt.fromAuthHeaderAsBearerToken()(req)
      },
      ignoreExpiration: false,
      secretOrKey: jwtSecretKey,
    })
  }

  async validate(payload: JwtPayloadWithOption) {
    try {
      const token = this.jwtService.sign(payload)
      return this.authService.getUserFromAccessToken(token)
    } catch (err) {
      throw new UnauthorizedException()
    }
  }

  private getTokenByCookies(cookies: Record<string, string>) {
    return cookies[JwtSubject.AccessToken]
  }
}
