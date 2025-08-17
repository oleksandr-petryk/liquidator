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

import { Gender } from '../../../../5_shared/enums/db.enum';

export class RegisterRequestBodyDto {
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@gmail.com',
    maxLength: 320,
    minLength: 5,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  @Matches(/^[A-Za-z0-9@._\-+]+$/, {
    message:
      'Only letters (a-z), numbers (0-9), and special charters are allowed',
  })
  email!: string;

  @ApiProperty({
    description: 'Username of user',
    type: String,
    example: 'example',
    maxLength: 15,
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  username!: string;

  @ApiProperty({
    description: 'User phone number',
    type: String,
    example: '+380970809685',
    maxLength: 15,
    minLength: 8,
    nullable: true,
  })
  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(15)
  phoneNumber?: string;

  @ApiProperty({
    description: 'User first name',
    type: String,
    example: 'john',
    maxLength: 15,
    minLength: 2,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(35)
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    type: String,
    example: 'doe',
    maxLength: 15,
    minLength: 2,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(35)
  lastName?: string;

  @ApiProperty({
    description: 'Date of user birth',
    type: String,
    example: '1991-09-17',
    format: 'date',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'User gender',
    type: String,
    example: 'male',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    description: 'User password',
    type: String,
    example: '123123',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password!: string;
}

export class LoginRequestBodyDto {
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@gmail.com',
    maxLength: 320,
    minLength: 5,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @ApiProperty({
    description: 'User password',
    type: String,
    example: '123123',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
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
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@gmail.com',
    maxLength: 320,
    minLength: 5,
  })
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
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@gmail.com',
    maxLength: 320,
    minLength: 5,
  })
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
