import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { Gender, Status } from '../../modules/drizzle/schemas';

export class CreateUserDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  // TODO: all this for each field
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@mail.com',
    maxLength: 320,
    minLength: 5,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(15)
  phoneNumber!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(35)
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(35)
  lastName!: string;

  @IsNotEmpty()
  @IsDate()
  dateOfBirth!: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsUUID()
  pictureId?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password!: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  recoveryEmailAddress!: string;
}
