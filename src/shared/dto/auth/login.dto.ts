import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class login {
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
    example: 'drowssap',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password!: string;
}
