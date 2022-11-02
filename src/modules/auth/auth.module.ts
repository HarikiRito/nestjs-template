import { Module } from '@nestjs/common'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { AuthResolver } from 'src/modules/auth/resolvers/auth.resolver'
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { UserService } from 'src/modules/user/services/user.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtSecretKey } from 'src/modules/auth/jwt.constant'
import { UserModule } from 'src/modules/user/user.module'
import { LocalStrategy } from 'src/modules/auth/strategies/local.strategy'
import { typeormRepositories } from 'src/typeorm-ex/typeormRepository'

@Module({
  controllers: [],
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecretKey,
    }),
    typeormRepositories,
  ],
  providers: [AuthService, UserService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
