import { Migrator } from '@mikro-orm/migrations'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { defineConfig } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { SeedManager } from '@mikro-orm/seeder'
import { join } from 'node:path'

import { env } from '@/config/env.schema'

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
  debug: env.NODE_ENV !== 'production',

  // Discovery configuration
  discovery: {
    warnWhenNoEntities: false,
  },

  driver: PostgreSqlDriver,

  // Timezone handling (reviewed for MikroORM v7 upgrade).
  //
  // MikroORM v7 defaults `forceUtcTimezone` to `true` for SQL drivers (v6 left it
  // off). We set it explicitly here to make the behavior intentional rather than an
  // implicit default. This is safe for this app: every `datetime` column
  // (BaseEntity.createdAt/updatedAt on all entities) is used only
  // as an absolute point in time — comparisons are Date-instant vs Date-instant
  // (e.g. `record.expiresAt < new Date()`), and all API serialization goes through
  // `new Date().toISOString()`, which is UTC regardless of this setting. No code
  // relies on local/non-UTC datetime handling, so forcing UTC changes nothing
  // observable while keeping stored timestamps unambiguous.
  forceUtcTimezone: true,

  // Entity discovery using compiled .js files (prevents duplicates)
  // Pattern matches: common/entities/*.js and features/**/entities/*.js
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],

  // Extensions
  extensions: [Migrator, SeedManager],

  // Migration configuration
  migrations: {
    allOrNothing: true,
    disableForeignKeys: false,
    dropTables: false,
    emit: 'ts',
    glob: '!(*.d).{js,ts}',
    path: join(__dirname, '../database/migrations'),
    pathTs: join(__dirname, '../database/migrations'),
    safe: true,
    snapshot: true,
    transactional: true,
  },

  metadataProvider: TsMorphMetadataProvider,

  // Pool configuration for better performance
  pool: {
    max: 10,
    min: 2,
  },

  preferTs: true,

  schema: env.DATABASE_SCHEMA,

  // Seeder configuration
  seeder: {
    defaultSeeder: 'DatabaseSeeder',
    emit: 'ts',
    glob: '!(*.d).{js,ts}',
    path: join(__dirname, '../database/seeders'),
    pathTs: join(__dirname, '../database/seeders'),
  },
})
