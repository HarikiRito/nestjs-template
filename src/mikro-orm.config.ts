import { MikroOrmModule } from '@mikro-orm/nestjs'
import { defineConfig, Options } from '@mikro-orm/core'
import { Logger } from '@nestjs/common'

const logger = new Logger('MikroORM')
const config: Options = {
  entities: [`./dist/**/entities/*`],
  entitiesTs: [`./src/**/entities/*`],
  type: 'postgresql',
  dbName: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logger: logger.log.bind(logger),
}

export const mikroOrmRoot = MikroOrmModule.forRoot(config)

export default defineConfig(config)
