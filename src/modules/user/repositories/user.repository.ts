import { CommonRepository } from 'src/modules/common/repositories/common.repository'
import { UserEntity } from 'src/modules/user/entities/user.entity'

export class UserRepository extends CommonRepository<UserEntity> {}
