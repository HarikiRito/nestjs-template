import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from 'src/modules/auth/services/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {}
}
