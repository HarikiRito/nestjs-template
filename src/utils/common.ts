import Sonyflake, { Epoch } from 'sonyflake'

export const snowflake = new Sonyflake({
  machineId: 1,
  epoch: Epoch.DISCORD, // timestamp
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
