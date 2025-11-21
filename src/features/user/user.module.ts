import { Module } from '@nestjs/common'

import { AppConfigModule } from '@/config/config.module'

import { UserController } from './controllers/user.controller'
import { UserResolver } from './resolvers/user.resolver'

/**
 * User Module
 *
 * Provides user-related functionality:
 * - GraphQL queries for user information
 * - REST API endpoints for user information
 * - Integration with JWT authentication
 */
@Module({
  controllers: [UserController],
  imports: [AppConfigModule],
  providers: [UserResolver],
})
export class UserModule {}
