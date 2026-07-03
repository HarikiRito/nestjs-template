import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { createKeyv } from '@keyv/redis'
import Redis from 'ioredis'

import { env } from '@/config/env.schema'

export const REDIS_CLIENT = 'REDIS_CLIENT'

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        stores: [createKeyv(env.REDIS_URL)],
      }),
    }),
  ],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => new Redis(env.REDIS_URL),
    },
  ],
  exports: [CacheModule, REDIS_CLIENT],
})
export class RedisModule {}
