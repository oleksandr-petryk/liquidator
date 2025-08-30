import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { OrganizationService } from '../../2_service/organization/organization.service';
import { APP_DEFAULT_V1_PREFIX } from '../../5_shared/config/const/app.const';
import { SWAGGER_TAGS } from '../../5_shared/config/const/swagger.const';
import { ApiAbstractResponse } from '../../5_shared/decorators/api-abstract-response.decorator';
import { GetUserFromRequest } from '../../5_shared/decorators/get-user-from-request.decorator';
import { JwtAccessGuard } from '../../5_shared/guards/auth.guard';
import { JwtTokenPayload } from '../../5_shared/interfaces/jwt-token.interface';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import { LoginResponseBodyDto } from '../../6_model/dto/io/auth/response-body.dto';

@ApiTags(SWAGGER_TAGS.organization.title)
@Controller(`${APP_DEFAULT_V1_PREFIX}/organization`)
export class OrganizationController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly organizationService: OrganizationService,
    private readonly dtoMapper: DtoMapper,
  ) {}

  @ApiOperation({
    summary: 'Get token with organization',
  })
  @ApiAbstractResponse(LoginResponseBodyDto)
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Post(':id/token')
  async getOrganizationTokens(
    @GetUserFromRequest() user: JwtTokenPayload,
    @Param('id') organizationId: string,
  ): Promise<LoginResponseBodyDto> {
    this.logger.info(
      `${this.getOrganizationTokens.name}, user: ${JSON.stringify(user)}, organizationId: ${JSON.stringify(organizationId)}`,
    );

    return await this.organizationService.generateOrganizationTokens({
      organizationId,
      userId: user.id,
      jti: user.jti,
    });
  }
}
