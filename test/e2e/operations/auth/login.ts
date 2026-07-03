import type { GraphQLClient, GraphQLResponse } from '../../utils/graphql'
import type { AuthResponse, LoginInput } from '../../types/auth'

export async function login(
  client: GraphQLClient,
  input: LoginInput,
): Promise<GraphQLResponse<{ login: AuthResponse }>> {
  return client.mutation<{ login: AuthResponse }>({
    mutation: `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          accessToken
          refreshToken
        }
      }
    `,
    variables: { input },
  })
}
