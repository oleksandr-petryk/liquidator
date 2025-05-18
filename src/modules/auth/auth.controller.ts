import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateUserDto } from '../../shared/dto/createUser.dto';
import { UserInsertModel } from '../../shared/modules/drizzle/schemas';
import { AuthControllerService } from './services/auth-controller.service';

@Controller('api/auth/v1/auth')
export class AuthController {
  constructor(private readonly AuthControllerService: AuthControllerService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto): Promise<UserInsertModel> {
    return this.AuthControllerService.register(dto);
  }

  @Get('log-in')
  login(): void {
    return this.AuthControllerService.login();
  }

  @Get('verify')
  verify(): void {
    return this.AuthControllerService.verify();
  }

  @Get('google')
  google(): void {
    return this.AuthControllerService.google();
  }

  @Get('google/callback')
  googleCallback(): void {
    return this.AuthControllerService.googleCallback();
  }
}
