import Sonyflake, { Epoch } from 'sonyflake'
import { Nullable } from '../types/common'

export const snowflake = new Sonyflake({
  machineId: 1,
  epoch: Epoch.TWITTER, // timestamp
})

// Golang asynchronus function
export async function goAwaited<T>(fn: () => Promise<T>): Promise<[Error | null, T | null]> {
  try {
    const result = await fn()
    return [null, result]
  } catch (e) {
    return [e, null]
  }
}

export function goFunction<T>(fn: () => T): [Nullable<Error>, Nullable<T>] {
  try {
    const result = fn()
    return [null, result]
  } catch (e) {
    return [e as Nullable<Error>, null]
  }
}
