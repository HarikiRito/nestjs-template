import { Migrator } from "@mikro-orm/migrations";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { defineConfig } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";
import { join } from "path";

import { env } from "@/config/env.schema";

/**
 * MikroORM configuration with type-safe environment variables
 *
 * Uses dotenv + TypeScript interface for type-safe environment access.
 *
 * Supports three modes via environment variables:
 * 1. Same DB + Same Schema: Set DATABASE_URI only
 * 2. Same DB + Different Schemas: Set DATABASE_URI + DATABASE_SCHEMA (default: 'public')
 * 3. Different DB: Set separate DATABASE_URI pointing to different database
 */
export default defineConfig({
	// Database connection
	clientUrl: env.DATABASE_URI,

	// Debug mode (only in development)
	debug: env.NODE_ENV !== "production",

	// Discovery configuration
	discovery: {
		alwaysAnalyseProperties: false,
		requireEntitiesArray: false,
		warnWhenNoEntities: false,
	},

	driver: PostgreSqlDriver,
	// Entity configuration
	// When using autoLoadEntities in NestJS, no need to specify entities here
	// Entities are discovered via forFeature() calls in modules

	// Entity discovery using compiled .js files (prevents duplicates)
	// Pattern matches: common/entities/*.js and features/**/entities/*.js
	entities: ["./dist/**/*.entity.js"],
	entitiesTs: ["./src/**/*.entity.ts"],

	// Extensions
	extensions: [Migrator, SeedManager],

	// Migration configuration
	migrations: {
		allOrNothing: true,
		disableForeignKeys: false,
		dropTables: false,
		emit: "ts",
		glob: "!(*.d).{js,ts}",
		path: join(__dirname, "../database/migrations"),
		pathTs: join(__dirname, "../database/migrations"),
		safe: true,
		snapshot: true,
		transactional: true,
	},

	// Pool configuration for better performance
	pool: {
		max: 10,
		min: 2,
	},

	schema: env.DATABASE_SCHEMA,

	// Seeder configuration
	seeder: {
		defaultSeeder: "DatabaseSeeder",
		emit: "ts",
		glob: "!(*.d).{js,ts}",
		path: join(__dirname, "../database/seeders"),
		pathTs: join(__dirname, "../database/seeders"),
	},
});
