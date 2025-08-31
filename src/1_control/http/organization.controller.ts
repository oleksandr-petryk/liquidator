import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags, OmitType } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { OrganizationService } from '../../2_service/organization/organization.service';
import { APP_DEFAULT_V1_PREFIX } from '../../5_shared/config/const/app.const';
import { SWAGGER_TAGS } from '../../5_shared/config/const/swagger.const';
import { ApiAbstractResponse } from '../../5_shared/decorators/api-abstract-response.decorator';
import { GetUserFromRequest } from '../../5_shared/decorators/get-user-from-request.decorator';
import { JwtAccessGuard } from '../../5_shared/guards/auth.guard';
import { JwtTokenPayload } from '../../5_shared/interfaces/jwt-token.interface';
import { paginationQueryToDrizzle } from '../../5_shared/utils/db.util';
import { PaginationQueryDto } from '../../6_model/dto/common/pagination-query.dto';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import {
  OrganizationDto,
  OrganizationPageableDto,
} from '../../6_model/dto/entities/organization.dto';
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

  @ApiOperation({
    summary: 'Get list of user organization',
  })
  @ApiAbstractResponse(OmitType(OrganizationDto, ['picture']), {
    pageable: true,
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Get()
  async getListOfUserOrganization(
    @Query() query: PaginationQueryDto,
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<OrganizationPageableDto> {
    this.logger.info(
      `${this.getListOfUserOrganization.name}, user: ${JSON.stringify(user)}, query: ${JSON.stringify(query)}`,
    );

    const result = await this.organizationService.getListOfUserOrganization(
      user,
      paginationQueryToDrizzle(query),
    );

    return new OrganizationPageableDto({
      items: result.items.map((i) => {
        const organization = this.dtoMapper.mapOrganizationDto(i);

        return organization;
      }),
      count: result.count,
    });
  }
}
