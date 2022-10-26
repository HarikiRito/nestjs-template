import { UserEntity } from 'src/modules/user/entities/user.entity'

export type JwtPayload = Pick<UserEntity, 'id' | 'username' | 'email'>
