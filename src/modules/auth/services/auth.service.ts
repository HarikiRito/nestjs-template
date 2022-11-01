import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository'
import { UserService } from 'src/modules/user/services/user.service'
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces'
import { JwtPayload } from 'src/modules/auth/auth.interface'
import bcrypt from 'bcryptjs'
import { UserEntity } from 'src/modules/user/entities/user.entity'
import dayjs from 'dayjs'

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

  async loginByUsername(username: string, password: string) {
    const user = await this.userService.findByUsername(username)

    if (!user || !user.password) {
      throw new Error('User not found')
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('User not found')
    }
    await this.saveAuthToken(user)

    return user
  }

  initAccessToken(payload: JwtPayload, options?: JwtSignOptions) {
    return {
      accessToken: this.jwtService.sign(payload, {
        ...options,
      }),
    }
  }

  async saveAuthToken(user: UserEntity) {
    const jwtTokenData = this.initAccessToken({
      username: user.username,
      id: user.id,
      email: user.email,
    })

    let authEntity = await this.authRepo.findOneBy({
      userId: user.id,
    })

    if (!authEntity) {
      const auth = this.authRepo.create({
        accessToken: jwtTokenData.accessToken,
        userId: user.id,
        refreshToken: jwtTokenData.accessToken,
        expiresAt: dayjs().add(30, 'day').toDate(),
      })
      authEntity = await this.authRepo.save(auth)
    }
    return authEntity
  }
}
