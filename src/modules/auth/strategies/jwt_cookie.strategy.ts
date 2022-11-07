import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/modules/user/services/user.service'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { jwtSecretKey } from 'src/modules/auth/jwt.constant'
import { AUTH_MODULE_OPTIONS } from 'src/modules/auth/auth.constant'
import { JwtPayload, JwtPayloadWithOption } from 'src/modules/auth/auth.interface'
import { Request } from 'express'

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies.token as string | undefined
      },
      ignoreExpiration: false,
      secretOrKey: jwtSecretKey,
    })
  }

  async validate(req: Request, payload: JwtPayloadWithOption) {
    try {
      console.log(req, payload)
      return this.userService.findById(payload.id)
    } catch (err) {
      throw new UnauthorizedException()
    }
  }
}
