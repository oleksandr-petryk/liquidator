import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { AuthService } from '../../2_service/auth/auth.service';
import { APP_DEFAULT_V1_PREFIX } from '../../5_shared/config/const/app.const';
import { SWAGGER_TAGS } from '../../5_shared/config/const/swagger.const';
import { ApiAbstractResponse } from '../../5_shared/decorators/api-abstract-response.decorator';
import { GetUserFromRequest } from '../../5_shared/decorators/get-user-from-request.decorator';
import {
  GetUserAgentAndIp,
  UserAgentAndIp,
} from '../../5_shared/decorators/user-agent-and-ip.decorator';
import { JwtAccessGuard } from '../../5_shared/guards/auth.guard';
import { JwtTokenPayload } from '../../5_shared/interfaces/jwt-token.interface';
import { paginationQueryToDrizzle } from '../../5_shared/utils/db.util';
import { PaginationQueryDto } from '../../6_model/dto/common/pagination-query.dto';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import {
  SessionDto,
  SessionPageableDto,
} from '../../6_model/dto/entities/session.dto';
import {
  AccountVerificationRequestBody,
  LoginRequestBodyDto,
  PasswordChangeRequestBody,
  PasswordResetRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBodyDto,
  SendPasswordResetEmailRequestBody,
  UpdateSessionRequestBody,
} from '../../6_model/dto/io/auth/request-body.dto';
import {
  AccountVerificationResponseBodyDto,
  LoginResponseBodyDto,
  PasswordResetResponseBodyDto,
  RefreshTokenResponseBodyDto,
  SendVerificationEmailResponseBodyDto,
} from '../../6_model/dto/io/auth/response-body.dto';

@ApiTags(SWAGGER_TAGS.auth.title)
@Controller(`${APP_DEFAULT_V1_PREFIX}/auth`)
export class AuthController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly authService: AuthService,
    private readonly dtoMapper: DtoMapper,
  ) {}

  @ApiOperation({
    summary: 'Register a new user',
  })
  @Post('register')
  async register(@Body() dto: RegisterRequestBodyDto): Promise<void> {
    this.logger.info(`${this.register.name}, dto: ${JSON.stringify(dto)}`);

    await this.authService.register(dto);
  }

  @ApiOperation({
    summary: 'Log-in',
  })
  @Post('log-in')
  async login(
    @GetUserAgentAndIp() agent: UserAgentAndIp,
    @Body() dto: LoginRequestBodyDto,
  ): Promise<LoginResponseBodyDto> {
    this.logger.info(`${this.login.name}, dto: ${JSON.stringify(dto)}`);

    const result = await this.authService.login(dto, agent);

    return this.dtoMapper.mapJwtTokensPairDto(result);
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

  @ApiOperation({
    summary: 'Get list of sessions',
  })
  @ApiAbstractResponse(SessionDto, { pageable: true })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Get('sessions')
  async getListOfSessions(
    @Query() query: PaginationQueryDto,
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<SessionPageableDto> {
    this.logger.info(
      `${this.getListOfSessions.name}, user: ${JSON.stringify(user)}, query: ${JSON.stringify(query)}`,
    );

    const result = await this.authService.getListOfSessions(
      user,
      paginationQueryToDrizzle(query),
    );

    return new SessionPageableDto({
      items: result.items.map((i) => {
        const session = this.dtoMapper.mapSessionDto(i);

        if (i.jti === user.jti) {
          session.thisDevice = true;
        } else {
          session.thisDevice = false;
        }

        return session;
      }),
      count: result.count,
    });
  }

  @ApiOperation({
    summary: 'Update session name',
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @ApiAbstractResponse(SessionDto)
  @Patch('sessions/:sessionId')
  async updateSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() data: UpdateSessionRequestBody,
  ): Promise<SessionDto> {
    this.logger.info(
      `${this.updateSession.name}, session id: ${JSON.stringify(sessionId)}, data: ${JSON.stringify(data)}`,
    );

    const response = await this.authService.updateSession({
      id: sessionId,
      name: data.name,
    });

    return this.dtoMapper.mapSessionDto(response);
  }

  @ApiOperation({
    summary: 'Delete session',
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @ApiAbstractResponse(SessionDto)
  @Delete('sessions/:sessionId')
  async deleteSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<void> {
    this.logger.info(
      `${this.deleteSession.name}, session id: ${JSON.stringify(sessionId)}`,
    );

    await this.authService.deleteSession({ id: sessionId });
  }

  @ApiOperation({
    summary: 'Account verification',
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @ApiAbstractResponse(AccountVerificationResponseBodyDto)
  @Post('verify')
  async accountVerification(
    @GetUserFromRequest() user: JwtTokenPayload,
    @Body() data: AccountVerificationRequestBody,
  ): Promise<AccountVerificationResponseBodyDto> {
    this.logger.info(
      `${this.accountVerification.name}, user: ${JSON.stringify(user)}, data: ${JSON.stringify(data)}`,
    );

    await this.authService.accountVerification({
      userId: user.id,
      code: data.code,
    });

    return { message: 'Account successfully verified' };
  }

  @ApiOperation({
    summary: 'Send new verification email',
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @ApiAbstractResponse(SendVerificationEmailResponseBodyDto)
  @Post('verify/send')
  async sendVerificationEmail(
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<SendVerificationEmailResponseBodyDto> {
    this.logger.info(
      `${this.sendVerificationEmail.name}, user: ${JSON.stringify(user)}`,
    );

    await this.authService.sendVerificationEmail(user.id);

    return { message: 'Verification email sent successfully' };
  }

  @ApiOperation({
    summary: 'Send password reset email',
  })
  @HttpCode(200)
  @Post('password-reset/send')
  async sendPasswordResetRequestEmail(
    @Body() data: SendPasswordResetEmailRequestBody,
  ): Promise<void> {
    this.logger.info(
      `${this.sendPasswordResetRequestEmail.name}, data: ${JSON.stringify(data)}`,
    );

    await this.authService.sendPasswordResetRequestEmail(data.email);
  }

  @ApiOperation({
    summary: 'Password reset',
  })
  @ApiAbstractResponse(PasswordResetResponseBodyDto)
  @Patch('password-reset')
  async passwordReset(
    @Body() data: PasswordResetRequestBody,
  ): Promise<PasswordResetResponseBodyDto | undefined> {
    this.logger.info(
      `${this.passwordReset.name}, data: ${JSON.stringify(data)}`,
    );

    return await this.authService.passwordReset(data);
  }

  @ApiOperation({
    summary: 'Password change',
  })
  @ApiAbstractResponse(PasswordResetResponseBodyDto)
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Patch('password-change')
  async changePassword(
    @GetUserFromRequest() user: JwtTokenPayload,
    @Body() data: PasswordChangeRequestBody,
  ): Promise<PasswordResetResponseBodyDto | undefined> {
    this.logger.info(
      `${this.changePassword.name}, data: ${JSON.stringify(data)}`,
    );

    return await this.authService.passwordChange({ userId: user.id, ...data });
  }

  @ApiOperation({
    summary: 'Refresh token',
  })
  @ApiAbstractResponse(RefreshTokenResponseBodyDto)
  @Post('refresh')
  async refreshToken(@Body() data: RefreshTokenRequestBody): Promise<string> {
    this.logger.info(
      `${this.refreshToken.name}, data: ${JSON.stringify(data)}`,
    );

    return await this.authService.refreshToken(data.refreshToken);
  }
}
