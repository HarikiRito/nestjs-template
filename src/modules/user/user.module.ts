import { Module } from '@nestjs/common'
import { UserService } from 'src/modules/user/services/user.service'
import { UserResolver } from 'src/modules/user/resolvers/user.resolver'
import { UserRepository } from './repositories/user.repository'
import { OrmModule } from '../orm/orm.module'
import { AuthRepository } from '../auth/repositories/auth.repository'

@Module({
  controllers: [],
  imports: [UserRepository, OrmModule, AuthRepository],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
