import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'

import mikroOrmConfig from '@/database/mikro-orm.config'

/**
 * Database configuration for NestJS MikroORM module
 * Reuses CLI config to ensure consistency
 */
export const databaseConfig = {
  ...mikroOrmConfig,
  autoLoadEntities: true,
  entities: [],
  entitiesTs: [],
  registerRequestContext: true,
} as unknown as MikroOrmModuleOptions
