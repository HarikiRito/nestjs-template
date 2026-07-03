import { Injectable } from '@nestjs/common'

import { env, type Env } from './env.schema'

/**
 * Application Configuration Service
 *
 * Provides type-safe access to environment configuration.
 * This service wraps the environment variables loaded via dotenv
 * and exposes configuration through structured getter methods.
 *
 * @example
 * ```typescript
 * constructor(private readonly config: AppConfigService) {}
 *
 * const port = this.config.port  // number (not string | undefined)
 * const dbConfig = this.config.database  // { uri: string, schema: string }
 * ```
 */
@Injectable()
export class AppConfigService {
  /**
   * CORS allowed origin
   * @returns CORS origin URL
   */
  get corsOrigin(): string {
    return this.env.CORS_ORIGIN
  }

  get jwtAccessExpiry(): string {
    return this.env.JWT_ACCESS_EXPIRY
  }

  get jwtRefreshExpiry(): string {
    return this.env.JWT_REFRESH_EXPIRY
  }

  /**
   * Database configuration
   * @returns Database connection details
   */
  get database() {
    return {
      schema: this.env.DATABASE_SCHEMA,
      uri: this.env.DATABASE_URI,
    } as const
  }

  /**
   * Check if running in development mode
   * @returns true if NODE_ENV is 'development'
   */
  get isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development'
  }

  /**
   * Check if running in production mode
   * @returns true if NODE_ENV is 'production'
   */
  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production'
  }

  /**
   * Check if running in test mode
   * @returns true if NODE_ENV is 'test'
   */
  get isTest(): boolean {
    return this.env.NODE_ENV === 'test'
  }

  /**
   * JWT secret for token signing/verification
   * @returns JWT secret string
   */
  get jwtSecret(): string {
    return this.env.JWT_SECRET
  }

  /**
   * Node environment mode
   * @returns 'development' | 'production' | 'test'
   */
  get nodeEnv(): 'development' | 'production' | 'test' {
    return this.env.NODE_ENV
  }

  /**
   * Application server port
   * @returns Validated port number (default: 3000)
   */
  get port(): number {
    return this.env.PORT
  }

  get redisUrl(): string {
    return this.env.REDIS_URL
  }

  private readonly env: Env = env
}
