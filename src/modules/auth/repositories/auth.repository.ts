import { CommonRepository } from 'src/modules/common/repositories/common.repository'
import { AuthEntity } from 'src/modules/auth/entities/auth.entity'

export class AuthRepository extends CommonRepository<AuthEntity> {}
