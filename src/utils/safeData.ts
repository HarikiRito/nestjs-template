export { ok, err, Result, ResultAsync } from 'neverthrow'

export const toError = (e: unknown): Error => (e instanceof Error ? e : new Error(String(e)))
