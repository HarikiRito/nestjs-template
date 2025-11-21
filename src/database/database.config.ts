import type { MikroOrmModuleOptions } from "@mikro-orm/nestjs";

import mikroOrmConfig from "@/database/mikro-orm.config";

/**
 * Database configuration for NestJS MikroORM module
 * Reuses CLI config to ensure consistency
 */
export const databaseConfig: MikroOrmModuleOptions = {
	...mikroOrmConfig,
	// NestJS-specific options
	autoLoadEntities: true, // Automatically discover entities from forFeature()
	// Override CLI entities config to prevent duplicates when using autoLoadEntities
	entities: [],
	entitiesTs: [],
	registerRequestContext: true, // Enable request context for proper transaction handling
};
