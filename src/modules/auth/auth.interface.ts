import { User } from 'src/modules/user/entities/user.entity'
import { Auth } from 'src/modules/auth/entities/auth.entity'
import { Platform } from 'src/modules/auth/dtos/auth.enum'

export type JwtPayload = Pick<User, 'id' | 'username' | 'email'> & Pick<Auth, 'deviceId'> & { platform: Platform }

export type JwtPayloadWithOption = JwtPayload & {
  exp?: number
  iat?: string
  sub?: string
}
