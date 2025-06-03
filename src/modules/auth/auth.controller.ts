import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { APP_DEFAULT_V1_PREFIX } from '../../shared/const/app.const';
import { SWAGGER_TAGS } from '../../shared/const/swagger.const';
import {
  LoginRequestBodyDto,
  RegisterRequestBodyDto,
} from '../../shared/dto/controllers/auth/request-body.dto';
import type { LoginResponseBodyDto } from '../../shared/dto/controllers/auth/response-body.dto';
import { JwtTokensPairMapper } from '../../shared/mappers/jwt.mapper';
import { AuthControllerService } from './services/auth-controller.service';

@ApiTags(SWAGGER_TAGS.auth.title)
@Controller(`${APP_DEFAULT_V1_PREFIX}/auth`)
export class AuthController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly authControllerService: AuthControllerService,
  ) {}

  @ApiOperation({
    summary: 'Register a new user',
  })
  @Post('register')
  async register(@Body() dto: RegisterRequestBodyDto): Promise<void> {
    this.logger.info(`register, dto: ${JSON.stringify(dto)}`);

    await this.authControllerService.register(dto);
  }

  @ApiOperation({
    summary: 'Log-in',
  })
  @Post('log-in')
  async login(@Body() dto: LoginRequestBodyDto): Promise<LoginResponseBodyDto> {
    this.logger.info(`login, dto: ${JSON.stringify(dto)}`);

    const result = await this.authControllerService.login(dto);

    return JwtTokensPairMapper.serialize(result);
  }

  // @Get('verify')
  // verify(): void {
  //   return this.authControllerService.verify();
  // }

  // @Get('google')
  // google(): void {
  //   return this.authControllerService.google();
  // }

  // @Get('google/callback')
  // googleCallback(): void {
  //   return this.authControllerService.googleCallback();
  // }
}
