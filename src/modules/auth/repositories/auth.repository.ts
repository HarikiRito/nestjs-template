import { CommonRepository } from 'src/modules/common/repositories/common.repository'
import { AuthEntity } from 'src/modules/auth/entities/auth.entity'
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator'

@CustomRepository(AuthEntity)
export class AuthRepository extends CommonRepository<AuthEntity> {}
