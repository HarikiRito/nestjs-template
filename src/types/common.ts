export type Nullable<T> = T | null

// Use this for valid any type inside the project
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Anything = any
export type AnyObject = Record<string, Anything>
