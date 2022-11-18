import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { dbRoot } from 'src/configs/db'
import { UserModule } from 'src/modules/user/user.module'
import { AuthModule } from 'src/modules/auth/auth.module'
import { Request } from 'express'
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      debug: true,
      cors: {
        credentials: true,
        origin: true,
      },
      context: ({ req, res, connection }: { req: Request; res: Response; connection: any }) => {
        if (connection) {
          // check connection for metadata
          return { req: connection.context as Request, res }
        } else {
          // check from req
          // return new GraphQLContext(req, res);
          return { req, res }
        }
      },
    }),
    dbRoot,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
