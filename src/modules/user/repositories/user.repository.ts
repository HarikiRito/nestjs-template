import { CommonRepository } from 'src/modules/common/repositories/common.repository'
import { UserEntity } from 'src/modules/user/entities/user.entity'
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator'

@CustomRepository(UserEntity)
export class UserRepository extends CommonRepository<UserEntity> {}
