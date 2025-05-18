import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SWAGGER_TAGS } from '../../shared/const/swagger.const';
import { AuthControllerService } from './services/auth-controller.service';

@ApiTags(SWAGGER_TAGS.auth.title)
@Controller('auth')
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
