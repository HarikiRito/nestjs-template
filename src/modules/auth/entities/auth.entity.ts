import { ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { User } from 'src/modules/user/entities/user.entity'
import { Property, Entity, ManyToOne, Cascade } from '@mikro-orm/core'
import { AuthRepository } from '../repositories/auth.repository'

@ObjectType()
@Entity({
  tableName: 'auths',
  repository: () => AuthRepository,
})
export class Auth extends CommonEntity {
  @Property({ nullable: true })
  deviceId?: string

  @Property({ type: 'varchar', length: 500 })
  accessToken: string

  @Property({ type: 'varchar', length: 500 })
  refreshToken: string

  @Property({ nullable: true })
  expiresAt?: Date

  @ManyToOne(() => User, {
    fieldName: 'userId',
    cascade: [Cascade.REMOVE],
  })
  user: User

  // [EntityRepositoryType]?: AuthRepository
}
