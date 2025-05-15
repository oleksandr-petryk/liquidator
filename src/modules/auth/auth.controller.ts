import { Controller, Get, Post } from '@nestjs/common';

import { AuthControllerService } from './services/auth-controller.service';

@Controller('api/auth/v1/auth')
export class AuthController {
  constructor(private readonly AuthControllerService: AuthControllerService) {}

  @Post('register')
  register(): void {
    return this.AuthControllerService.register();
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
