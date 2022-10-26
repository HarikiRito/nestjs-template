import { Module } from '@nestjs/common'
import { UserService } from 'src/modules/user/services/user.service'
import { UserResolver } from 'src/modules/user/resolvers/user.resolver'
import { UserRepository } from 'src/modules/user/repositories/user.repository'
import { TypeormExModule } from 'src/typeorm-ex/typeorm-ex.module'

@Module({
  controllers: [],
  imports: [TypeormExModule.forCustomRepository([UserRepository])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
