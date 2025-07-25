import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { APP_DEFAULT_V1_PREFIX } from '../../shared/const/app.const';
import { SWAGGER_TAGS } from '../../shared/const/swagger.const';
import { ApiAbstractResponse } from '../../shared/decorators/api-abstract-response.decorator';
import { GetUserFromRequest } from '../../shared/decorators/get-user-from-request.decorator';
import {
  GetUserAgentAndIp,
  UserAgentAndIp,
} from '../../shared/decorators/user-agent-and-ip.decorator';
import { PaginationQueryDto } from '../../shared/dto/common/pagination-query.dto';
import {
  LoginRequestBodyDto,
  RegisterRequestBodyDto,
  UpdateSessionRequestBody,
} from '../../shared/dto/controllers/auth/request-body.dto';
import type { LoginResponseBodyDto } from '../../shared/dto/controllers/auth/response-body.dto';
import {
  SessionDto,
  SessionPageableDto,
} from '../../shared/dto/entities/session.dto';
import { JwtAccessGuard } from '../../shared/guards/auth.guard';
import { JwtTokenPayload } from '../../shared/interfaces/jwt-token.interface';
import { DtoMapper } from '../../shared/services/dto.mapper';
import { paginationQueryToDrizzle } from '../../shared/utils/db.util';
import { AuthService } from './services/auth.service';

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
      `${this.getListOfSessions.name}, user Id: ${JSON.stringify(user)}, query: ${JSON.stringify({ ...query })}`,
    );

    const result = await this.authService.getListOfSessions(
      user,
      paginationQueryToDrizzle(query),
    );

    return new SessionPageableDto({
      items: result.items.map((i) => this.dtoMapper.mapSessionDto(i)),
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

    await this.authService.deleteSession(sessionId);
  }
}
