import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, RequiredEntityData } from '@mikro-orm/postgresql'
import * as argon2 from 'argon2'
import { Cache } from 'cache-manager'
import { Result, ResultAsync } from 'neverthrow'

import { env } from '@/config/env.schema'
import { User } from '@/features/user/entities/user.entity'
import { UserRepository } from '@/features/user/repositories/user.repository'
import { toError } from '@/utils/safeData'

import {
  AUTH_CACHE_KEYS,
  GENERIC_AUTH_ERROR,
  isTokenBlacklisted,
} from '../constants/auth.constants'
import { AuthResponse } from '../types/auth-response.type'
import { LoginInput } from '../dto/login.input'
import { SignupInput } from '../dto/signup.input'

const LOCK_TTL_MS = 10_000

export interface JwtPayload {
  sub: string
  email: string
  jti: string
  exp: number
  type: 'access' | 'refresh'
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async signup(input: SignupInput): Promise<AuthResponse> {
    const email = input.email
    const name = input.name
    const password = await argon2.hash(input.password)
    const user = this.em.create(User, {
      email: email,
      password,
      name: name,
    } as RequiredEntityData<User>)
    const flush = await ResultAsync.fromPromise(this.em.flush(), toError)
    if (flush.isErr()) {
      const msg = flush.error.message
      if (msg.includes('unique') || msg.includes('duplicate')) {
        throw new ConflictException('Email already in use')
      }
      throw flush.error
    }

    return this.issueTokens(String(user.id), email)
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({ email: input.email })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await argon2.verify(user.password, input.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    return this.issueTokens(String(user.id), user.email)
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const verifyResult = Result.fromThrowable(
      () => this.jwtService.verify<JwtPayload>(refreshToken),
      toError,
    )()
    if (verifyResult.isErr()) throw new UnauthorizedException(GENERIC_AUTH_ERROR)

    const payload = verifyResult.value
    if (payload.type !== 'refresh') throw new UnauthorizedException(GENERIC_AUTH_ERROR)

    const [blacklisted, existingLock] = await Promise.all([
      isTokenBlacklisted(this.cache, payload.jti),
      this.cache.get(AUTH_CACHE_KEYS.refreshLock(payload.jti)),
    ])
    if (blacklisted) throw new UnauthorizedException(GENERIC_AUTH_ERROR)
    if (existingLock) throw new UnauthorizedException('Refresh already in progress')

    const lockResult = await ResultAsync.fromPromise(
      this.cache.set(AUTH_CACHE_KEYS.refreshLock(payload.jti), 1, LOCK_TTL_MS),
      toError,
    )
    if (lockResult.isErr()) throw new UnauthorizedException('Could not acquire refresh lock')

    const tokenResult = await ResultAsync.fromPromise(
      this.blacklistToken(payload.jti, this.getRemainingTtlMs(payload)).then(() =>
        this.issueTokens(payload.sub, payload.email),
      ),
      toError,
    )

    await this.cache.del(AUTH_CACHE_KEYS.refreshLock(payload.jti))

    if (tokenResult.isErr()) throw tokenResult.error
    return tokenResult.value
  }

  async logout(accessToken: string, refreshToken: string): Promise<boolean> {
    const accessResult = Result.fromThrowable(
      () => this.jwtService.verify<JwtPayload>(accessToken),
      toError,
    )()
    if (accessResult.isOk() && accessResult.value.jti) {
      await this.blacklistToken(accessResult.value.jti, this.getRemainingTtlMs(accessResult.value))
    }

    const refreshResult = Result.fromThrowable(
      () => this.jwtService.verify<JwtPayload>(refreshToken),
      toError,
    )()
    if (refreshResult.isOk() && refreshResult.value.jti) {
      await this.blacklistToken(
        refreshResult.value.jti,
        this.getRemainingTtlMs(refreshResult.value),
      )
    }

    return true
  }

  private async issueTokens(userId: string, email: string): Promise<AuthResponse> {
    const accessJti = crypto.randomUUID()
    const refreshJti = crypto.randomUUID()

    const accessToken = this.jwtService.sign(
      { sub: userId, email, jti: accessJti, type: 'access' },
      { expiresIn: env.JWT_ACCESS_EXPIRY as `${number}${'s' | 'm' | 'h' | 'd'}` },
    )
    const refreshToken = this.jwtService.sign(
      { sub: userId, email, jti: refreshJti, type: 'refresh' },
      { expiresIn: env.JWT_REFRESH_EXPIRY as `${number}${'s' | 'm' | 'h' | 'd'}` },
    )

    return { accessToken, refreshToken }
  }

  private async blacklistToken(jti: string, ttlMs: number): Promise<void> {
    if (ttlMs <= 0) return
    await this.cache.set(AUTH_CACHE_KEYS.blacklist(jti), 1, ttlMs)
  }

  private getRemainingTtlMs(payload: JwtPayload): number {
    return Math.max(0, payload.exp * 1000 - Date.now())
  }
}
