import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'

import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { CommonModule } from '@/common/common.module'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { AppConfigModule } from '@/config/config.module'
import { DatabaseModule } from '@/database/database.module'
import { AuthModule } from '@/features/auth/auth.module'
import { TodoModule } from '@/features/todo/todo.module'
import { UserModule } from '@/features/user/user.module'
import { RedisModule } from '@/providers/redis/redis.module'

@Module({
  controllers: [AppController],
  imports: [
    // Infrastructure modules
    AppConfigModule,
    DatabaseModule,
    CommonModule,

    // GraphQL module
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true, // Generate schema in memory (code-first)
      driver: ApolloDriver,
      path: '/graphql', // GraphQL endpoint path
      playground: false, // Disable deprecated playground
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Apollo Server v5 landing page
      sortSchema: true, // Sort schema alphabetically for consistency
    }),

    // Provider modules
    RedisModule,

    // Feature modules
    AuthModule,
    TodoModule,
    UserModule,
  ],
  providers: [
    AppService,
    // Register JWT Auth Guard globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
