import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { APP_DEFAULT_V1_PREFIX } from '../../shared/const/app.const';
import { SWAGGER_TAGS } from '../../shared/const/swagger.const';
import {
  LoginRequestBodyDto,
  PatchSessionRequestBodyDto,
  RegisterRequestBodyDto,
} from '../../shared/dto/controllers/auth/request-body.dto';
import type { LoginResponseBodyDto } from '../../shared/dto/controllers/auth/response-body.dto';
import { JwtTokensPairMapper } from '../../shared/mappers/jwt.mapper';
import { SessionSelectModel } from '../../shared/types/db.type';
import { AuthControllerService } from './services/auth-controller.service';

@ApiTags(SWAGGER_TAGS.auth.title)
@Controller(`${APP_DEFAULT_V1_PREFIX}/auth`)
export class AuthController {
  constructor(private readonly authControllerService: AuthControllerService) {}

  @ApiOperation({
    summary: 'Register a new user',
  })
  @Post('register')
  async register(@Body() dto: RegisterRequestBodyDto): Promise<void> {
    await this.authControllerService.register(dto);
  }

  @ApiOperation({
    summary: 'Log-in',
  })
  @Post('log-in')
  async login(@Body() dto: LoginRequestBodyDto): Promise<LoginResponseBodyDto> {
    const result = await this.authControllerService.login(dto);

    return JwtTokensPairMapper.serialize(result);
  }

  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Get all user session',
  })
  @Get('session')
  async getSessions(
    @Headers('authorization') token: string,
  ): Promise<Omit<SessionSelectModel, 'user'>[]> {
    return await this.authControllerService.getSessions(
      token.split(' ').slice(1).join(' '),
    );
  }

  @ApiOperation({
    summary: 'Update session name',
  })
  @Patch('session/:id')
  updateSessionName(
    @Body() name: PatchSessionRequestBodyDto,
    @Param('id') id: string,
  ): Promise<Omit<SessionSelectModel, 'user'> | unknown> {
    return this.authControllerService.updateSessionName(name, id);
  }

  @ApiOperation({
    summary: 'Delete session',
  })
  @Delete('session/:id')
  deleteSession(
    @Param('id') id: string,
  ): Promise<Omit<SessionSelectModel, 'user'>> {
    return this.authControllerService.deleteSession(id);
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
