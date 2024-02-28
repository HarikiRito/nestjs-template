import { ZodTypeAny } from 'zod'

export type ZodRecordType<T> = Record<keyof T, ZodTypeAny>
