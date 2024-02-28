import { Injectable, UnauthorizedException } from '@nestjs/common'
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
import { GraphQLContext } from 'src/modules/common/decorators/common.decorator'
import { Platform } from 'src/modules/auth/dtos/auth.enum'
import { UserRepository } from '../../user/repositories/user.repository'
import { ExtractJwt } from 'passport-jwt'
import { EntityManager } from '@mikro-orm/core'

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly authRepo: AuthRepository,
    private readonly userRepo: UserRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async loginByEmail(input: LoginInput): Promise<[UserEntity, AuthEntity]> {
    const user = await this.userService.findByEmail(input.email)

    if (!bcrypt.compareSync(input.password, user?.password || '')) {
      throw new Error('User not found')
    }
    const auth = await this.saveAuthToken(user, {
      deviceId: input.deviceId,
      platform: input.platform,
    })

    return [user, auth]
  }

  initAccessToken(payload: JwtPayload, options?: JwtSignOptions) {
    return {
      accessToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: '14d',
        subject: JwtSubject.AccessToken,
      }),
      refreshToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: '60d',
        subject: JwtSubject.RefreshToken,
      }),
    }
  }

  async saveAuthToken(user: UserEntity, authData: Pick<AuthEntity, 'deviceId'> & { platform: Platform }) {
    const jwtTokenData = this.initAccessToken({
      username: user.username,
      id: user.id,
      email: user.email,
      deviceId: authData?.deviceId,
      platform: authData.platform,
    })

    let authEntity: AuthEntity
    if (authData.platform === Platform.Web) {
      // Create new token if user login from web
      authEntity = this.authRepo.create({
        user: user,
      })
    }

    if (authData.platform === Platform.Mobile) {
      if (!authData.deviceId) throw new ApolloError('Device id is required')
      // Update token if user login from mobile with the same device id
      authEntity = await this.authRepo.findOne({
        user: user,
        deviceId: authData?.deviceId,
      })

      if (!authEntity) {
        authEntity = this.authRepo.create({
          user: user,
        })
      }

      authEntity.deviceId = authData?.deviceId
    }

    this._updateAuthEntityJwtToken(authEntity, jwtTokenData)
    authEntity = await this.authRepo.upsert(authEntity)

    return authEntity
  }

  saveTokenToCookie(ctx: GraphQLContext, authEntity: AuthEntity) {
    ctx.res.cookie(JwtSubject.AccessToken, authEntity.accessToken, {
      httpOnly: true,
      sameSite: true,
      expires: dayjs((this.jwtService.decode(authEntity.accessToken) as JwtPayloadWithOption).exp * 1000).toDate(),
    })

    ctx.res.cookie(JwtSubject.RefreshToken, authEntity.refreshToken, {
      httpOnly: true,
      sameSite: true,
      expires: dayjs((this.jwtService.decode(authEntity.refreshToken) as JwtPayloadWithOption).exp * 1000).toDate(),
    })
  }

  async renewAccessToken(refreshToken: string) {
    const invalidRefreshTokenError = 'Invalid refresh token'
    const data = (await this.jwtService.verify(refreshToken, {
      ignoreExpiration: false,
    })) as (JwtPayload & { exp: number; iat: number; sub: string }) | null

    if (!data || data.sub !== JwtSubject.RefreshToken || data.exp < dayjs().unix())
      throw new Error(invalidRefreshTokenError)

    const authEntity = await this.authRepo.findOne({
      refreshToken: refreshToken,
    })

    // If user uses an invalid refresh token, we will throw an error and removing all the token issue for that user
    if (!authEntity) {
      // await this._revokeAllTokenByUserId(data.id)
      throw new ApolloError(invalidRefreshTokenError)
    }

    const oldPayload = this.jwtService.decode(authEntity.accessToken) as JwtPayloadWithOption

    const payload = purgeObject(oldPayload, ['exp', 'iat', 'sub']) as JwtPayload
    const jwtData = this.initAccessToken(payload)
    this._updateAuthEntityJwtToken(authEntity, jwtData)
    await this.authRepo.nativeUpdate(authEntity.id, authEntity)
    return authEntity
  }

  async getAuthEntityByAccessToken(token: string) {
    return this.authRepo.findOne({
      accessToken: token,
    })
  }

  private _updateAuthEntityJwtToken(authEntity: AuthEntity, jwtData: { accessToken: string; refreshToken: string }) {
    authEntity.accessToken = jwtData.accessToken
    authEntity.refreshToken = jwtData.refreshToken
    authEntity.expiresAt = dayjs().add(30, 'day').toDate()
  }

  private async _revokeAllTokenByUserId(id: string) {
    const authEntities = await this.authRepo.find({
      user: {
        id: id,
      },
    })
    await this.authRepo.nativeDelete(authEntities)
  }

  async getUserFromAccessToken(accessToken: string) {
    const payload = this.jwtService.decode(accessToken) as JwtPayloadWithOption | null

    if (!payload || !payload.exp) throw new UnauthorizedException()

    const authEntity = await this.getAuthEntityByAccessToken(accessToken)

    if (!authEntity) {
      throw new UnauthorizedException()
    }

    if (dayjs(payload.exp * 1000).isBefore(dayjs())) {
      throw new UnauthorizedException()
    }

    return this.userRepo.findOne({
      id: payload.id,
    })
  }

  async logout(ctx: GraphQLContext) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(ctx.req)

    const auth = await this.authRepo.findOne({
      accessToken,
    })

    if (!auth) throw new UnauthorizedException('Token is invalid')

    await this.em.nativeDelete(AuthEntity, auth)

    return true
  }
}
