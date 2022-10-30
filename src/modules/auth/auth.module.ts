import { Module } from '@nestjs/common'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { AuthResolver } from 'src/modules/auth/resolvers/auth.resolver'
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository'
import { TypeormExModule } from 'src/typeorm-ex/typeorm-ex.module'
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { UserService } from 'src/modules/user/services/user.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserRepository } from 'src/modules/user/repositories/user.repository'
import { jwtSecretKey } from 'src/modules/auth/jwt.constant'
import { UserModule } from 'src/modules/user/user.module'

@Module({
  controllers: [],
  imports: [
    UserModule,
    TypeormExModule.forCustomRepository([AuthRepository, UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecretKey,
    }),
  ],
  providers: [AuthService, UserService, AuthResolver, JwtStrategy, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
