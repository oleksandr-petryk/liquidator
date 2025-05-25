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
  MaxLength,
} from 'class-validator';

import { Gender } from '../../modules/drizzle/schemas';

export class CreateUserDto {
  // TODO: all this for each field
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
    description: 'User phone number',
    type: String,
    example: '+380970809685',
    maxLength: 15,
    minLength: 8,
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(15)
  phoneNumber!: string;

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
    description: 'User first name',
    type: String,
    example: 'john',
    maxLength: 15,
    minLength: 2,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(35)
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    type: String,
    example: 'doe',
    maxLength: 15,
    minLength: 2,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(35)
  lastName!: string;

  @ApiProperty({
    description: 'Date of user birth',
    type: String,
    example: '1991-09-17',
    format: 'date',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateOfBirth!: Date;

  @ApiProperty({
    description: 'User gender',
    type: String,
    example: 'male',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    description: 'User password',
    type: String,
    example: 'drowssap',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password!: string;

  @ApiProperty({
    description: 'User recovery email',
    type: String,
    example: 'example002@gmail.com',
    maxLength: 320,
    minLength: 5,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  recoveryEmailAddress!: string;
}
