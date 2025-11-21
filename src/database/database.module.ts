import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { databaseConfig } from '@/database/database.config'

/**
 * Database Module
 *
 * Configures MikroORM with PostgreSQL for the backend
 * Supports flexible schema/database separation via environment variables
 */
@Module({
  imports: [MikroOrmModule.forRoot(databaseConfig)],
})
export class DatabaseModule {}
