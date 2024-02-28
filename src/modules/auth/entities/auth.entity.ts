import { ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { UserEntity } from 'src/modules/user/entities/user.entity'
import { Property, Entity, ManyToOne, Cascade } from '@mikro-orm/core'
import { AuthRepository } from '../repositories/auth.repository'

@ObjectType()
@Entity({
  tableName: 'auths',
  repository: () => AuthRepository,
})
export class AuthEntity extends CommonEntity {
  @Property({ nullable: true })
  deviceId?: string

  @Property({ type: 'text' })
  accessToken: string

  @Property({ type: 'text' })
  refreshToken: string

  @Property({ nullable: true })
  expiresAt?: Date

  @ManyToOne(() => UserEntity, {
    fieldName: 'userId',
    cascade: [Cascade.REMOVE],
  })
  user: UserEntity
}
