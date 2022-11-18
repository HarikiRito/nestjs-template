import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/modules/user/services/user.service'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { jwtSecretKey, JwtSubject } from 'src/modules/auth/jwt.constant'
import { AUTH_MODULE_OPTIONS } from 'src/modules/auth/auth.constant'
import { JwtPayload, JwtPayloadWithOption } from 'src/modules/auth/auth.interface'
import { Request } from 'express'

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.[JwtSubject.AccessToken]
        },
      ]),
      secretOrKey: jwtSecretKey,
    })
  }

  async validate(payload: JwtPayloadWithOption) {
    try {
      console.log(payload)
      return this.userService.findById(payload.id)
    } catch (err) {
      throw new UnauthorizedException()
    }
  }
}
