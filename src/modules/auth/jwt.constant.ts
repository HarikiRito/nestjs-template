export const jwtSecretKey = process.env.JWT_SECRET || 'secretKey'

export enum JwtSubject {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
}
