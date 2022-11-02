import { UserEntity } from 'src/modules/user/entities/user.entity'
import { AuthEntity } from 'src/modules/auth/entities/auth.entity'
import { JwtSubject } from 'src/modules/auth/jwt.constant'

export type JwtPayload = Pick<UserEntity, 'id' | 'username' | 'email'> & Pick<AuthEntity, 'deviceId'>

export type JwtPayloadWithOption = JwtPayload & {
  exp?: string
  iat?: string
  sub?: string
}
