import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SWAGGER_TAGS } from '../../shared/const/swagger.const';
import { CreateUserDto } from '../../shared/dto/auth/createUser.dto';
import { login } from '../../shared/dto/auth/login.dto';
import { UserInsertModel } from '../../shared/modules/drizzle/schemas';
import { AuthControllerService } from './services/auth-controller.service';

@ApiTags(SWAGGER_TAGS.auth.title)
@Controller('auth')
export class AuthController {
  constructor(private readonly authControllerService: AuthControllerService) {}

  // TODO: all this for each endpoint
  @ApiOperation({
    summary: 'Register a new user',
  })
  @Post('register')
  register(@Body() dto: CreateUserDto): Promise<UserInsertModel> {
    return this.authControllerService.register(dto);
  }

  @Get('log-in')
  login(@Body() dto: login): Promise<string> {
    return this.authControllerService.login(dto);
  }

  @Get('verify')
  verify(): void {
    return this.authControllerService.verify();
  }

  @Get('google')
  google(): void {
    return this.authControllerService.google();
  }

  @Get('google/callback')
  googleCallback(): void {
    return this.authControllerService.googleCallback();
  }
}
