export function generateRandomNumeric(length: number): string {
  const buf = new Uint32Array(length)
  crypto.getRandomValues(buf)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += String(buf[i]! % 10)
  }
  return result
}

export function generateRandomAlpha(length: number): string {
  const buf = new Uint32Array(length)
  crypto.getRandomValues(buf)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(65 + (buf[i]! % 26))
  }
  return result
}
