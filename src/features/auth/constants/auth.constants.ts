import type { Cache } from 'cache-manager'

export const AUTH_CACHE_KEYS = {
  blacklist: (jti: string) => `auth:blacklist:${jti}`,
  refreshLock: (jti: string) => `auth:lock:refresh:${jti}`,
} as const

export async function isTokenBlacklisted(cache: Cache, jti: string): Promise<boolean> {
  const val = await cache.get(AUTH_CACHE_KEYS.blacklist(jti))
  return val !== null && val !== undefined
}

export const GENERIC_AUTH_ERROR = 'Invalid or expired session'
