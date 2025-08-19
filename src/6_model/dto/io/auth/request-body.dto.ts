import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { USER_PROPERTIES } from '../../../../5_shared/config/const/user.const';
import { Gender } from '../../../../5_shared/enums/db.enum';

export class RegisterRequestBodyDto {
  @ApiProperty(USER_PROPERTIES.email)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  @Matches(/^[A-Za-z0-9@._\-+]+$/, {
    message:
      'Only letters (a-z), numbers (0-9), and special charters are allowed',
  })
  email!: string;

  @ApiProperty(USER_PROPERTIES.username)
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  username!: string;

  @ApiProperty(USER_PROPERTIES.phoneNumber)
  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(15)
  phoneNumber?: string;

  @ApiProperty(USER_PROPERTIES.firstName)
  @IsOptional()
  @IsString()
  @MaxLength(35)
  firstName?: string;

  @ApiProperty(USER_PROPERTIES.lastName)
  @IsOptional()
  @IsString()
  @MaxLength(35)
  lastName?: string;

  @ApiProperty(USER_PROPERTIES.dateOfBirth)
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiProperty(USER_PROPERTIES.gender)
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty(USER_PROPERTIES.password)
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class LoginRequestBodyDto {
  @ApiProperty(USER_PROPERTIES.email)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @ApiProperty(USER_PROPERTIES.password)
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class UpdateSessionRequestBody {
  @ApiProperty({
    description: 'Session name',
    type: String,
    example: 'MacBook',
    minLength: 1,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  name!: string;
}

export class AccountVerificationRequestBody {
  @ApiProperty({
    description: 'Verification code',
    type: String,
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code!: string;
}

export class SendPasswordResetEmailRequestBody {
  @ApiProperty(USER_PROPERTIES.email)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  @Matches(/^[A-Za-z0-9@._\-+]+$/, {
    message:
      'Only letters (a-z), numbers (0-9), and special charters are allowed',
  })
  email!: string;
}

export class PasswordResetRequestBody {
  @ApiProperty(USER_PROPERTIES.email)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  @Matches(/^[A-Za-z0-9@._\-+]+$/, {
    message:
      'Only letters (a-z), numbers (0-9), and special charters are allowed',
  })
  email!: string;

  @ApiProperty({
    description: 'Code',
    type: String,
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code!: string;

  @ApiProperty({
    description: 'New user password',
    type: String,
    example: '123123',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  newPassword!: string;
}

export class PasswordChangeRequestBody {
  @ApiProperty({
    description: 'Old user password',
    type: String,
    example: '123123',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  oldPassword!: string;

  @ApiProperty({
    description: 'New user password',
    type: String,
    example: '321321',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  newPassword!: string;
}

export class RefreshTokenRequestBody {
  @ApiProperty({
    description: 'Refresh token',
    type: String,
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
