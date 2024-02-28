import { Module } from '@nestjs/common'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { AuthResolver } from 'src/modules/auth/resolvers/auth.resolver'
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { UserService } from 'src/modules/user/services/user.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtSecretKey } from 'src/modules/auth/jwt.constant'
import { UserModule } from 'src/modules/user/user.module'
import { JwtCookieStrategy } from 'src/modules/auth/strategies/jwt_cookie.strategy'
import { JwtMixedStrategy } from 'src/modules/auth/strategies/jwt_mixed.strategy'
import { OrmModule } from '../orm/orm.module'

@Module({
  controllers: [],
  imports: [
    UserModule,
    PassportModule,
    OrmModule,
    JwtModule.register({
      secret: jwtSecretKey,
    }),
  ],
  providers: [AuthService, UserService, AuthResolver, JwtStrategy, JwtCookieStrategy, JwtMixedStrategy],
  exports: [AuthService],
})
export class AuthModule {}
