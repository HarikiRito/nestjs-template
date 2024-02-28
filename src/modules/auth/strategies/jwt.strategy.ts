import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/modules/user/services/user.service'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { jwtSecretKey } from 'src/modules/auth/jwt.constant'
import { JwtPayloadWithOption } from 'src/modules/auth/auth.interface'
import { AuthGuardType } from 'src/modules/auth/guards/jwt.guard'
import { UserRepository } from 'src/modules/user/repositories/user.repository'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthGuardType.Jwt) {
  constructor(
    private readonly userService: UserService,
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req)
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
}
