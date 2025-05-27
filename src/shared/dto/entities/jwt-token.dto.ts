import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

import type {
  JwtAccessToken,
  JwtRefreshToken,
  JwtTokensPair,
} from '../../interfaces/jwt-token.interface';

export class JwtAccessTokenDto implements JwtAccessToken {
  @ApiProperty({
    description: 'JWT access token',
    type: String,
  })
  @IsJWT()
  accessToken!: string;

  constructor(props: JwtAccessTokenDto) {
    Object.assign(this, props);
  }
}

export class JwtRefreshTokenDto implements JwtRefreshToken {
  @ApiProperty({
    description: 'JWT refresh token',
    type: String,
  })
  @IsJWT()
  refreshToken!: string;

  constructor(props: JwtRefreshTokenDto) {
    Object.assign(this, props);
  }
}

export class JwtTokensPairDto
  extends IntersectionType(JwtAccessTokenDto, JwtRefreshTokenDto)
  implements JwtTokensPair
{
  constructor(props: JwtTokensPairDto) {
    super(props);
    Object.assign(this, props);
  }
}
