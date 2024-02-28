import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Request } from 'express'
import GraphQLJSON from 'graphql-type-json'
import { AnyObject, Anything } from 'src/types/common'

export const graphqlModule = GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  sortSchema: true,
  subscriptions: {
    'graphql-ws': true,
    'subscriptions-transport-ws': {
      // This protocol is used by the GraphQL Playground only for legacy reason and debugging.
      onConnect: (connectionParams: AnyObject) => {
        return { headers: connectionParams }
      },
    },
  },
  plugins: [],
  context: ({ req, res, connection }: { req: Request; res: Response; connection: Anything }) => {
    if (connection) {
      // check connection for metadata
      return { req: connection.context as Request, res }
    } else {
      // check from req
      return { req, res }
    }
  },
  resolvers: { JSON: GraphQLJSON },
})
