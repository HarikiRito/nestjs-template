import type { GraphQLClient, GraphQLResponse } from '../../utils/graphql'
import type { AuthResponse, SignupInput } from '../../types/auth'

export async function signup(
  client: GraphQLClient,
  input: SignupInput,
): Promise<GraphQLResponse<{ signup: AuthResponse }>> {
  return client.mutation<{ signup: AuthResponse }>({
    mutation: `
      mutation Signup($input: SignupInput!) {
        signup(input: $input) {
          accessToken
          refreshToken
        }
      }
    `,
    variables: { input },
  })
}
