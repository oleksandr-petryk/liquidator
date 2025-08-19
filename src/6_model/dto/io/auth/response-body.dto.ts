import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { JwtTokensPairDto } from '../../entities/jwt-token.dto';
import { UserDto } from '../../entities/user.dto';

export class LoginResponseBodyDto extends JwtTokensPairDto {}

export class GetPictureResponseBodyDto {
  @ApiProperty({
    description: 'Picture url',
    type: String,
    example:
      'http://localhost:4566/pictures/888328e6-e457-480e-a581-874a0ea5cfe7?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=test%2F20250802%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250802T224326Z&X-Amz-Expires=3600&X-Amz-Signature=e9d0462098adb836a17a5170a5c36f76c6c3db64ae97a1213935cf8f5bcc02ed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject',
  })
  url!: string;
}

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

export class SendVerificationEmailResponseBodyDto {
  @ApiProperty({
    description: 'Verification email sent message',
    type: String,
    example: 'Verification email sent successfully',
  })
  @IsNotEmpty()
  @IsString()
  message!: 'Verification email sent successfully';
}

export class GetUserResponseBodyDto extends OmitType(UserDto, [
  'status',
  'picture',
]) {}

export class PasswordResetResponseBodyDto {
  @ApiProperty({
    description: 'Password reset message',
    type: String,
    example: 'Password successfully changed',
  })
  @IsNotEmpty()
  @IsString()
  message!: 'Password successfully changed';
}

export class RefreshTokenResponseBodyDto {
  @ApiProperty({
    description: 'Access token',
    type: String,
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh token',
    type: String,
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
