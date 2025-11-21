import { Global, Module } from '@nestjs/common'

import { AppConfigService } from '@/config/config.service'

/**
 * Global Configuration Module
 *
 * Provides type-safe, validated environment configuration
 * throughout the application. Available globally - no need to import
 * in feature modules.
 *
 * The module exposes AppConfigService which wraps the validated
 * environment schema and provides structured access to all
 * configuration values.
 *
 * @example
 * ```typescript
 * // In any service or controller (no import needed!)
 * constructor(private readonly config: AppConfigService) {}
 *
 * // Use type-safe configuration
 * const dbUri = this.config.database.uri
 * const port = this.config.port
 * ```
 */
@Global()
@Module({
  exports: [AppConfigService],
  providers: [AppConfigService],
})
export class AppConfigModule {}
