import { faker } from '@faker-js/faker'

export interface TestUser {
  email: string
  password: string
  name: string
}

export function generateTestUser(overrides?: Partial<TestUser>): TestUser {
  return {
    email: faker.internet.email(),
    password: `Test${faker.string.alphanumeric(8)}1!`,
    name: faker.person.fullName(),
    ...overrides,
  }
}
