import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { env } from '@/config/env.schema'
import { User } from '@/features/user/entities/user.entity'

import { AuthResolver } from './resolvers/auth.resolver'
import { AuthService } from './services/auth.service'

@Module({
  imports: [MikroOrmModule.forFeature([User]), JwtModule.register({ secret: env.JWT_SECRET })],
  providers: [AuthService, AuthResolver],
  exports: [JwtModule],
})
export class AuthModule {}
