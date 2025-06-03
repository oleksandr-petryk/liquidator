import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';

import type { EnvConfig } from '../../../shared/config/configuration';
import type {
  JwtTokenPayload,
  JwtTokensPair,
} from '../../../shared/interfaces/jwt-token.interface';

/**
 * Internal JWT tokens service
 */
@Injectable()
export class JwtInternalService {
  private readonly JWT_ACCESS_KEY_PRIVATE: string;
  private readonly JWT_ACCESS_KEY_PUBLIC: string;
  readonly JWT_ACCESS_ALGORITHM = 'RS256';
  readonly JWT_ACCESS_TOKEN_EXPIRES_IN: number;

  private readonly JWT_REFRESH_KEY_PRIVATE: string;
  private readonly JWT_REFRESH_KEY_PUBLIC: string;
  readonly JWT_REFRESH_ALGORITHM = 'RS256';
  readonly JWT_REFRESH_TOKEN_EXPIRES_IN: number;

  constructor(
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService<EnvConfig>,
    private readonly jwtService: JwtService,
  ) {
    // Access
    this.JWT_ACCESS_KEY_PRIVATE = this.configService.getOrThrow(
      'JWT_ACCESS_KEY_PRIVATE',
    );
    this.JWT_ACCESS_KEY_PUBLIC = this.configService.getOrThrow(
      'JWT_ACCESS_KEY_PUBLIC',
    );
    this.JWT_ACCESS_TOKEN_EXPIRES_IN = this.configService.getOrThrow(
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    );

    // Refresh
    this.JWT_REFRESH_KEY_PRIVATE = this.configService.getOrThrow(
      'JWT_REFRESH_KEY_PRIVATE',
    );
    this.JWT_REFRESH_KEY_PUBLIC = this.configService.getOrThrow(
      'JWT_REFRESH_KEY_PUBLIC',
    );
    this.JWT_REFRESH_TOKEN_EXPIRES_IN = this.configService.getOrThrow(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    );
  }

  /**
   * Generate access token
   *
   * @param payload JWT payload
   * @returns JWT
   */
  generateAccessToken(payload: JwtTokenPayload): string {
    return this.jwtService.sign(payload, {
      privateKey: this.JWT_ACCESS_KEY_PRIVATE,
      algorithm: this.JWT_ACCESS_ALGORITHM,
      expiresIn: this.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * Generate refresh token
   *
   * @param payload JWT payload
   * @returns JWT
   */
  generateRefreshToken(payload: JwtTokenPayload): string {
    return this.jwtService.sign(payload, {
      privateKey: this.JWT_REFRESH_KEY_PRIVATE,
      algorithm: this.JWT_REFRESH_ALGORITHM,
      expiresIn: this.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * Generate tokens pair
   *
   * @param payload
   * @returns tokens pair
   */
  generatePairTokens(payload: JwtTokenPayload): JwtTokensPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify access token
   *
   * @param token JWT
   * @returns verified and decoded token
   */
  verifyAccessToken(token: string): JwtTokenPayload {
    return this.jwtService.verify(token, {
      publicKey: this.JWT_ACCESS_KEY_PUBLIC,
      algorithms: [this.JWT_ACCESS_ALGORITHM],
    });
  }

  /**
   * Verify refresh token
   *
   * @param token JWT
   * @returns verified and decoded token
   */
  verifyRefreshToken(token: string): JwtTokenPayload {
    return this.jwtService.verify(token, {
      publicKey: this.JWT_REFRESH_KEY_PUBLIC,
      algorithms: [this.JWT_REFRESH_ALGORITHM],
    });
  }
}
