import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/modules/user/services/user.service'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { jwtSecretKey } from 'src/modules/auth/jwt.constant'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecretKey,
    })
  }

  async validate(username: string, password: string) {
    console.log(username)
    try {
      return await this.authService.validateUser(username, password)
    } catch (err) {
      throw new UnauthorizedException()
    }
  }
}
