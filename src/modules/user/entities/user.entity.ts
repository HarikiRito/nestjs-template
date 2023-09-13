import { HideField, ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { Entity, Property, Unique, OneToMany, Collection } from '@mikro-orm/core'
import { UserRepository } from '../repositories/user.repository'
import { AuthEntity } from '../../auth/entities/auth.entity'

@ObjectType()
@Entity({
  tableName: 'users',
  repository: () => UserRepository,
})
export class UserEntity extends CommonEntity {
  @Property()
  username: string

  @Property({ nullable: true })
  email?: string

  @HideField()
  @Property()
  password?: string

  @HideField()
  @Property()
  passwordSalt?: string

  @HideField()
  @OneToMany(() => AuthEntity, (auth) => auth.user)
  auths = new Collection<AuthEntity>(this)
  // [EntityRepositoryType]?: UserRepository
}
