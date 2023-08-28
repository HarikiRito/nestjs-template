import { MikroOrmModule } from '@mikro-orm/nestjs'
import { defineConfig } from '@mikro-orm/core'
export const mikroOrmRoot = MikroOrmModule.forRoot({
  entities: [`./dist/**/entities/*`],
  entitiesTs: [`./src/**/entities/*`],
  type: 'postgresql',
  dbName: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
})
