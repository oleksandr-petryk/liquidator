/**
 * JWT payload
 */
export interface JwtTokenPayload {
  /**
   * User ID
   */
  id: string;
}

/**
 * An object with accessToken
 */
export interface JwtAccessToken {
  accessToken: string;
}

/**
 * An object with refreshToken
 */
export interface JwtRefreshToken {
  refreshToken: string;
}

/**
 * JWT tokens pair structure
 */
export interface JwtTokensPair extends JwtAccessToken, JwtRefreshToken {}
