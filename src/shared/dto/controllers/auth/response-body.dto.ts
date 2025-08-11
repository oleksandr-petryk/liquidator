import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { JwtTokensPairDto } from '../../entities/jwt-token.dto';

export class LoginResponseBodyDto extends JwtTokensPairDto {}

export class AccountVerificationResponseBodyDto {
  @ApiProperty({
    description: 'Account verification message',
    type: String,
    example: 'Account successfully verified',
  })
  @IsNotEmpty()
  @IsString()
  message!: 'Account successfully verified';
}

export class SendVerificatioEmailResponseBodyDto {
  @ApiProperty({
    description: 'Verification email sent message',
    type: String,
    example: 'Verification email sent successfully',
  })
  @IsNotEmpty()
  @IsString()
  message!: 'Verification email sent successfully';
}
