import { Module } from '@nestjs/common'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { AuthResolver } from 'src/modules/auth/resolvers/auth.resolver'
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository'
import { TypeormExModule } from 'src/typeorm-ex/typeorm-ex.module'

@Module({
  controllers: [],
  imports: [TypeormExModule.forCustomRepository([AuthRepository])],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
