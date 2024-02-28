import { MikroOrmModule } from '@mikro-orm/nestjs'
import { defineConfig, Options } from '@mikro-orm/core'
import { Logger } from '@nestjs/common'
import { envVars } from './config/envConfig'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'

const logger = new Logger('MikroORM')
const config: Options = {
  entities: [`./dist/**/entities/*`],
  entitiesTs: [`./src/**/entities/*`],
  driver: PostgreSqlDriver,
  dbName: envVars.database.database,
  port: envVars.database.port,
  host: envVars.database.host,
  user: envVars.database.user,
  password: envVars.database.password,
  logger: logger.log.bind(logger),
}

export const mikroOrmRoot = MikroOrmModule.forRoot(config)

export default defineConfig(config)
