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
  JWT_SECRET: string
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
}

/**
 * Load and parse environment variables with defaults
 */
function loadEnv(): Env {
  return {
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    DATABASE_SCHEMA: process.env.DATABASE_SCHEMA ?? 'public',
    // DATABASE_URI is required for the app to function, will throw at runtime if missing
    // biome-ignore lint/style/noNonNullAssertion: Required env var validated at startup
    DATABASE_URI: process.env.DATABASE_URI!,
    // JWT_SECRET is required for authentication
    // biome-ignore lint/style/noNonNullAssertion: Required env var validated at startup
    JWT_SECRET: process.env.JWT_SECRET!,
    NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) ?? 'development',
    PORT: Number.parseInt(process.env.PORT ?? '3000', 10),
  }
}

/**
 * Type-safe environment configuration
 *
 * Loaded once at module initialization with dotenv
 */
export const env = loadEnv()
