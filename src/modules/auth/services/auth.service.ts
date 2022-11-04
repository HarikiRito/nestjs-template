import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository'
import { UserService } from 'src/modules/user/services/user.service'
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces'
import { JwtPayload, JwtPayloadWithOption } from 'src/modules/auth/auth.interface'
import bcrypt from 'bcryptjs'
import { UserEntity } from 'src/modules/user/entities/user.entity'
import dayjs from 'dayjs'
import { JwtSubject } from 'src/modules/auth/jwt.constant'
import { AuthEntity } from 'src/modules/auth/entities/auth.entity'
import { LoginInput } from 'src/modules/auth/dtos/auth.input'
import { ApolloError } from 'apollo-server-express'
import { purgeObject } from 'src/utils/object'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async loginByUsername(input: LoginInput) {
    const user = await this.userService.findByUsername(input.username)

    if (!user || !user.password) {
      throw new Error('User not found')
    }

    if (!bcrypt.compareSync(input.password, user.password)) {
      throw new Error('User not found')
    }
    await this.saveAuthToken(user, {
      deviceId: input.deviceId,
    })

    return user
  }

  initAccessToken(payload: JwtPayload, options?: JwtSignOptions) {
    return {
      accessToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: '30d',
        subject: JwtSubject.AccessToken,
      }),
      refreshToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: '60d',
        subject: JwtSubject.RefreshToken,
      }),
    }
  }

  async saveAuthToken(user: UserEntity, authData?: Pick<AuthEntity, 'deviceId'>) {
    const jwtTokenData = this.initAccessToken({
      username: user.username,
      id: user.id,
      email: user.email,
      deviceId: authData?.deviceId,
    })

    let authEntity = await this.authRepo.findOneBy({
      userId: user.id,
      deviceId: authData?.deviceId,
    })

    if (!authEntity) {
      authEntity = this.authRepo.create({
        userId: user.id,
      })
    }

    this._updateAuthEntityJwtToken(authEntity, jwtTokenData)
    authEntity.deviceId = authData?.deviceId
    authEntity = await this.authRepo.save(authEntity)
    return authEntity
  }

  async renewAccessToken(refreshToken: string) {
    const invalidRefreshTokenError = 'Invalid refresh token'
    const data = (await this.jwtService.verify(refreshToken, {
      ignoreExpiration: false,
    })) as (JwtPayload & { exp: number; iat: number; sub: string }) | null

    console.log(data)
    if (!data || data.sub !== JwtSubject.RefreshToken || data.exp < dayjs().unix())
      throw new Error(invalidRefreshTokenError)

    const authEntity = await this.authRepo.findOneBy({
      refreshToken: refreshToken,
    })

    // If user use an invalid refresh token, we will throw an error and removing all the token issue for that user
    if (!authEntity) {
      await this._revokeAllTokenByUserId(data.id)
      throw new ApolloError(invalidRefreshTokenError)
    }

    const oldPayload = this.jwtService.decode(authEntity.accessToken) as JwtPayloadWithOption

    const payload = purgeObject(oldPayload, ['exp', 'iat', 'sub']) as JwtPayload
    const jwtData = this.initAccessToken(payload)
    this._updateAuthEntityJwtToken(authEntity, jwtData)
    await this.authRepo.update(authEntity.id, authEntity)
    return authEntity
  }

  private _updateAuthEntityJwtToken(authEntity: AuthEntity, jwtData: { accessToken: string; refreshToken: string }) {
    authEntity.accessToken = jwtData.accessToken
    authEntity.refreshToken = jwtData.refreshToken
    authEntity.expiresAt = dayjs().add(30, 'day').toDate()
  }

  private async _revokeAllTokenByUserId(id: string) {
    const authEntities = await this.authRepo.find({
      select: {
        id: true,
      },
      where: {
        userId: id,
      },
    })
    await this.authRepo.softRemove(authEntities)
  }
}
