import { UserEntity } from 'src/modules/user/entities/user.entity'
import { AuthEntity } from 'src/modules/auth/entities/auth.entity'
import { Platform } from 'src/modules/auth/dtos/auth.enum'

export type JwtPayload = Pick<UserEntity, 'id' | 'username' | 'email'> &
  Pick<AuthEntity, 'deviceId'> & { platform: Platform }

export type JwtPayloadWithOption = JwtPayload & {
  exp?: number
  iat?: string
  sub?: string
}
