import { MikroOrmModule } from '@mikro-orm/nestjs'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'

export const mikroOrmForRootTest = MikroOrmModule.forRoot({
  driver: PostgreSqlDriver,
  connect: false,
  dbName: 'test',
  port: 65432,
  entities: [`./dist/**/entities/*`],
  entitiesTs: [`./src/**/entities/*`],
})
