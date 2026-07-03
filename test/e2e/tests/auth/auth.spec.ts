import { expect, test } from '@playwright/test'

import { generateTestUser } from '../../helpers/generate-test-user'
import { login } from '../../operations/auth/login'
import { signup } from '../../operations/auth/signup'
import { createGraphQLClient } from '../../utils/graphql'
import { refreshToken } from '../../operations/auth/refresh-token'
import { GENERIC_AUTH_ERROR } from '@/features/auth/constants/auth.constants'

test.describe('Auth', () => {
  test('signup creates a new user and returns tokens', async ({ request }) => {
    const client = createGraphQLClient(request)
    const user = generateTestUser()

    const result = await signup(client, user)

    expect(result.errors).toBeUndefined()
    expect(result.data?.signup.accessToken).toBeTruthy()
    expect(result.data?.signup.refreshToken).toBeTruthy()
  })

  test('login with valid credentials returns tokens', async ({ request }) => {
    const client = createGraphQLClient(request)
    const user = generateTestUser()

    await signup(client, user)

    const result = await login(client, {
      email: user.email,
      password: user.password,
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.login.accessToken).toBeTruthy()
    expect(result.data?.login.refreshToken).toBeTruthy()
  })

  test('signup with duplicate email returns conflict error', async ({ request }) => {
    const client = createGraphQLClient(request)
    const user = generateTestUser()

    await signup(client, user)
    const result = await signup(client, user)

    expect(result.errors).toBeDefined()
    expect(result.errors?.[0]?.message).toMatch(/already in use/i)
  })

  test('signup with weak password returns validation error', async ({ request }) => {
    const client = createGraphQLClient(request)
    const user = generateTestUser({ password: 'weakpassword' })

    const result = await signup(client, user)

    expect(result.errors).toBeDefined()
    expect(result.errors?.[0]?.message).toMatch(/uppercase|lowercase|number|password/i)
  })

  test('login with wrong password returns error', async ({ request }) => {
    const client = createGraphQLClient(request)
    const user = generateTestUser()

    await signup(client, user)

    const result = await login(client, {
      email: user.email,
      password: 'WrongPassword1!',
    })

    expect(result.errors).toBeDefined()
    expect(result.data?.login).toBeFalsy()
  })
})

test.describe('Refresh', () => {
  test('a valid refresh token returns a new pair', async ({ request }) => {
    const client = createGraphQLClient(request)
    const user = generateTestUser()

    const signUpResult = await signup(client, user)
    const oldRefreshToken = signUpResult.data!.signup.refreshToken

    const result = await refreshToken(client, { refreshToken: oldRefreshToken })

    expect(result.errors).toBeUndefined()
    expect(result.data?.refreshToken.refreshToken).toBeTruthy()
    expect(result.data?.refreshToken.accessToken).toBeTruthy()
  })

  test('new access token actually works', async ({ request }) => {
    const client = createGraphQLClient(request)
    const user = generateTestUser()

    const signUpResult = await signup(client, user)
    const oldRefreshToken = signUpResult.data!.signup.refreshToken

    const result = await refreshToken(client, { refreshToken: oldRefreshToken })
    const newAccessToken = result.data!.refreshToken.accessToken

    const queryResult = await client
      .withAuth(newAccessToken)
      .query({ query: 'query { me { id email } }' })
    expect(queryResult.errors).toBeUndefined()
  })

  test('rotation is rejected', async ({ request }) => {
    const client = createGraphQLClient(request)
    const user = generateTestUser()

    const signUpResult = await signup(client, user)
    const oldRefreshToken = signUpResult.data!.signup.refreshToken

    await refreshToken(client, { refreshToken: oldRefreshToken })
    const refreshSecondTimeResult = await refreshToken(client, { refreshToken: oldRefreshToken })

    expect(refreshSecondTimeResult.errors).toBeDefined()
  })

  test('generic error on garbage token', async ({ request }) => {
    const client = createGraphQLClient(request)

    const result = await refreshToken(client, { refreshToken: 'not-a-jwt' })

    expect(result.errors).toBeDefined()
    expect(result.errors?.[0]?.message).toEqual(GENERIC_AUTH_ERROR)
  })
})
