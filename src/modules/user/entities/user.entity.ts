import { HideField, ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { Entity, Property, Unique } from '@mikro-orm/core'
import { UserRepository } from '../repositories/user.repository'

@ObjectType()
@Entity({
  tableName: 'users',
  repository: () => UserRepository,
})
export class User extends CommonEntity {
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

  // [EntityRepositoryType]?: UserRepository
}
