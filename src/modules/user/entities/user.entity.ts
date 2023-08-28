import { HideField, ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { Entity, Property, EntityRepositoryType } from '@mikro-orm/core'
import { UserRepository } from '../repositories/user.repository'

@ObjectType()
@Entity({
  tableName: 'users',
  customRepository: () => UserRepository,
})
export class User extends CommonEntity {
  @Property()
  username: string

  @Property()
  email?: string

  @HideField()
  @Property()
  password?: string

  @HideField()
  @Property()
  passwordSalt?: string

  // [EntityRepositoryType]?: UserRepository
}
