import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository'
import { UserService } from 'src/modules/user/services/user.service'
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async findOne() {
    return this.authRepo.find()
  }

  async validateUser(username: string, password: string) {
    console.log(this.initAccessToken({ username }))
    return await this.userService.loginByUsername(username, password)
  }

  initAccessToken(payload: object, options?: JwtSignOptions) {
    return {
      accessToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: '30 days',
      }),
    }
  }
}
