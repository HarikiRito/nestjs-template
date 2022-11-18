import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/modules/user/services/user.service'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { jwtSecretKey, JwtSubject } from 'src/modules/auth/jwt.constant'
import { JwtPayloadWithOption } from 'src/modules/auth/auth.interface'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.[JwtSubject.AccessToken]
        },
      ]),
      secretOrKey: jwtSecretKey,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayloadWithOption) {
    const p = this.validateByRequest(req)
    console.log(p)
    try {
      return this.userService.findById(payload.id)
    } catch (err) {
      throw new UnauthorizedException()
    }
  }

  private validateByRequest(req: Request) {
    let payload: JwtPayloadWithOption
    if (req.cookies) {
      payload = this.validateByCookies(req.cookies)
    }

    // If payload is null, then try using the Authorization header as a fallback
    if (!payload) {
      payload = this.validateBearerToken(req)
    }

    return payload
  }

  private validateByCookies(cookies: Record<string, string>) {
    const accessToken = cookies[JwtSubject.AccessToken]
    return this.decodeToken(accessToken)
  }

  private validateBearerToken(req: Request) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    return this.decodeToken(accessToken)
  }

  private decodeToken(token: string) {
    try {
      return this.jwtService.decode(token) as JwtPayloadWithOption | null
    } catch (e) {
      return null
    }
  }
}
