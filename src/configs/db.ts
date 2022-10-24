import { TypeOrmModule } from '@nestjs/typeorm'
import { SampleEntity } from 'src/modules/sample/entities/sample.entity'

export const dbRoot = TypeOrmModule.forRoot({
  type: 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNC === 'true',
  entities: [`${process.cwd()}/src/**/*.entity.js`, SampleEntity],
  logging: process.env.DATABASE_LOGGING !== 'false',
})
