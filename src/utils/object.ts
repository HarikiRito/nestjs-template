export function purgeObject<T>(obj: T, keys: Array<keyof T>): Record<keyof T, unknown> {
  const newObj = { ...obj }
  keys.forEach((key) => {
    delete newObj[key]
  })
  return newObj
}
