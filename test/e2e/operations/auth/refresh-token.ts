import type { GraphQLClient, GraphQLResponse } from '../../utils/graphql'
import type { AuthResponse, RefreshTokenInput } from '../../types/auth'

export async function refreshToken(
  client: GraphQLClient,
  input: RefreshTokenInput,
): Promise<GraphQLResponse<{ refreshToken: AuthResponse }>> {
  return client.mutation<{ refreshToken: AuthResponse }>({
    mutation: `
        mutation RefreshToken($input: RefreshTokenInput!) {
            refreshToken(input: $input) {
                accessToken
                refreshToken
            }
        }
    `,
    variables: { input },
  })
}
