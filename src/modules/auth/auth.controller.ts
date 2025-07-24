import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { APP_DEFAULT_V1_PREFIX } from '../../shared/const/app.const';
import { SWAGGER_TAGS } from '../../shared/const/swagger.const';
import { GetUserFromRequest } from '../../shared/decorators/get-user-from-request.decorator';
import {
  LoginRequestBodyDto,
  RegisterRequestBodyDto,
} from '../../shared/dto/controllers/auth/request-body.dto';
import type { LoginResponseBodyDto } from '../../shared/dto/controllers/auth/response-body.dto';
import { JwtAccessGuard } from '../../shared/guards/auth.guard';
import { JwtTokenPayload } from '../../shared/interfaces/jwt-token.interface';
import { JwtTokensPairMapper } from '../../shared/mappers/jwt.mapper';
import { AuthService } from './services/auth.service';
import { SessionMapper } from '../../shared/mappers/session.mapper';
import { SessionDto } from '../../shared/dto/entities/session.dto';

@ApiTags(SWAGGER_TAGS.auth.title)
@Controller(`${APP_DEFAULT_V1_PREFIX}/auth`)
export class AuthController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Register a new user',
  })
  @Post('register')
  async register(@Body() dto: RegisterRequestBodyDto): Promise<void> {
    this.logger.info(`register, dto: ${JSON.stringify(dto)}`);

    await this.authService.register(dto);
  }

  @ApiOperation({
    summary: 'Log-in',
  })
  @Post('log-in')
  async login(@Body() dto: LoginRequestBodyDto): Promise<LoginResponseBodyDto> {
    this.logger.info(`login, dto: ${JSON.stringify(dto)}`);

    const result = await this.authService.login(dto);

    return JwtTokensPairMapper.serialize(result);
  }

  // @Get('verify-account')
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

  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Get('sessions')
  async getListOfSessions(
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<SessionDto[]> {
    const result = await this.authService.getListOfSessions(user);

    return result.map((i) => SessionMapper.serialize(i));
  }

  @Get('sessions/:id')
  updateSession(): void {
    console.log('Here we are!');
  }

  @Delete('sessions/:id')
  deleteSession(): void {
    console.log('Here we are!');
  }
}
