import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '@/common/entities/base.entity'
import { UserRepository } from '@/features/user/repositories/user.repository'

@Entity({ tableName: 'users', repository: () => UserRepository })
export class User extends BaseEntity {
  @Property({ unique: true, length: 255 })
  email!: string

  @Property({ hidden: true, length: 255 })
  password!: string

  @Property({ length: 255 })
  name!: string

  @Property({ type: 'json', nullable: true })
  settings?: Record<string, unknown>
}
