import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { JwtTokensPairDto } from '../../entities/jwt-token.dto';

export class LoginResponseBodyDto extends JwtTokensPairDto {}

export class SessionResponseBodyDto {
  @ApiProperty({
    description: 'Refresh token',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  token!: string;
}
