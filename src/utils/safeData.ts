export class SafeData<Data, E = Error> {
  data?: Data
  error?: E

  hasData(): this is { data: Data; error?: E } {
    return !this.hasError()
  }

  private hasError(): this is { data?: Data; error: E } {
    return !!this.error
  }
}

export async function guardAsync<D>(func: () => Promise<D>) {
  const safeData = new SafeData<D>()
  try {
    safeData.data = await func()
  } catch (error) {
    safeData.error = error as Error
  }
  return safeData
}

export function guardSync<D>(func: () => D) {
  const safeData = new SafeData<D>()
  try {
    safeData.data = func()
  } catch (error) {
    safeData.error = error as Error
  }
  return safeData
}
