import type { APIRequestContext } from '@playwright/test'

export interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: {
    message: string
    locations?: { line: number; column: number }[]
    path?: (string | number)[]
    extensions?: Record<string, unknown>
  }[]
}

export class GraphQLClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
    private readonly accessToken?: string,
  ) {}

  withAuth(accessToken: string): GraphQLClient {
    return new GraphQLClient(this.request, this.baseURL, accessToken)
  }

  async query<T = unknown>(options: {
    query: string
    variables?: Record<string, unknown>
    headers?: Record<string, string>
  }): Promise<GraphQLResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    const response = await this.request.post(`${this.baseURL}/graphql`, {
      headers,
      data: {
        query: options.query,
        variables: options.variables,
      },
    })

    return response.json() as Promise<GraphQLResponse<T>>
  }

  async mutation<T = unknown>(options: {
    mutation: string
    variables?: Record<string, unknown>
    headers?: Record<string, string>
  }): Promise<GraphQLResponse<T>> {
    return this.query<T>({
      query: options.mutation,
      variables: options.variables,
      headers: options.headers,
    })
  }
}

export function createGraphQLClient(request: APIRequestContext): GraphQLClient {
  const baseURL = `http://127.0.0.1:${process.env.PORT || 34850}`
  return new GraphQLClient(request, baseURL)
}
