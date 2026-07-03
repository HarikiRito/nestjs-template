import type { EntityManager } from '@mikro-orm/core'
import { BaseRepository } from '@/common/repositories/base.repository'
import { User } from '@/features/user/entities/user.entity'

export class UserRepository extends BaseRepository<User> {
  constructor(em: EntityManager) {
    super(em, User)
  }
}
