import { TypeormExModule } from 'src/typeorm-ex/typeorm-ex.module'
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository'
import { UserRepository } from 'src/modules/user/repositories/user.repository'

export const typeormRepositories = TypeormExModule.forCustomRepository([
  AuthRepository,
  UserRepository,
])
