import { ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { User } from 'src/modules/user/entities/user.entity'
import { Property, Entity, ManyToOne, EntityRepositoryType } from '@mikro-orm/core'
import { AuthRepository } from '../repositories/auth.repository'

@ObjectType()
@Entity({
  tableName: 'auths',
  customRepository: () => AuthRepository,
})
export class Auth extends CommonEntity {
  @Property({
    type: 'bigint',
  })
  userId: string

  @Property({ nullable: true })
  deviceId?: string

  @Property()
  accessToken: string

  @Property()
  refreshToken: string

  @Property({ nullable: true })
  expiresAt?: Date

  @ManyToOne(() => User)
  user: User

  // [EntityRepositoryType]?: AuthRepository
}
