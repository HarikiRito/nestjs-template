import { config } from 'dotenv'

// Load .env file at module initialization
config()

/**
 * Type-safe environment configuration interface
 */
export interface Env {
  CORS_ORIGIN: string
  DATABASE_SCHEMA: string
  DATABASE_URI: string
  JWT_ACCESS_EXPIRY: string
  JWT_REFRESH_EXPIRY: string
  JWT_SECRET: string
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  REDIS_URL: string
}

/**
 * Load and parse environment variables with defaults
 */
function loadEnv(): Env {
  return {
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    DATABASE_SCHEMA: process.env.DATABASE_SCHEMA ?? 'public',
    // biome-ignore lint/style/noNonNullAssertion: Required env var validated at startup
    DATABASE_URI: process.env.DATABASE_URI!,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY ?? '15m',
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY ?? '7d',
    // biome-ignore lint/style/noNonNullAssertion: Required env var validated at startup
    JWT_SECRET: process.env.JWT_SECRET!,
    NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) ?? 'development',
    PORT: Number.parseInt(process.env.PORT ?? '3000', 10),
    // biome-ignore lint/style/noNonNullAssertion: Required env var validated at startup
    REDIS_URL: process.env.REDIS_URL!,
  }
}

/**
 * Type-safe environment configuration
 *
 * Loaded once at module initialization with dotenv
 */
export const env = loadEnv()
