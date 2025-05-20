import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class login {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  password!: string;
}
