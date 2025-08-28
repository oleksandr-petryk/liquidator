import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { OrganizationService } from '../../2_service/organization/organization.service';
import { SWAGGER_TAGS } from '../../5_shared/config/const/swagger.const';
import { ApiAbstractResponse } from '../../5_shared/decorators/api-abstract-response.decorator';
import { GetUserFromRequest } from '../../5_shared/decorators/get-user-from-request.decorator';
import { JwtAccessGuard } from '../../5_shared/guards/auth.guard';
import { JwtTokenPayload } from '../../5_shared/interfaces/jwt-token.interface';
import { paginationQueryToDrizzle } from '../../5_shared/utils/db.util';
import { PaginationQueryDto } from '../../6_model/dto/common/pagination-query.dto';
import { DtoMapper } from '../../6_model/dto/dto.mapper';
import { MemberPageableDto } from '../../6_model/dto/entities/member.dto';
import { LoginResponseBodyDto } from '../../6_model/dto/io/auth/response-body.dto';
import { CreateOrganizationRequestBodyDto } from '../../6_model/dto/io/organization/request-body.dto';
import { CreateOrganizationResponseBodyDto } from '../../6_model/dto/io/organization/response-body.dto';

@ApiTags(SWAGGER_TAGS.organization.title)
@Controller()
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
  async getOrganizationToken(
    @GetUserFromRequest() user: JwtTokenPayload,
    @Param('id') organizationId: string,
  ): Promise<LoginResponseBodyDto> {
    return await this.organizationService.generatePairTokens({
      organizationId,
      userId: user.id,
      jti: user.jti,
    });
  }

  @ApiOperation({
    summary: 'Get user organizations',
  })
  @ApiAbstractResponse(MemberPageableDto)
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Get()
  async getListUserOrganizations(
    @Query() query: PaginationQueryDto,
    @GetUserFromRequest() user: JwtTokenPayload,
  ): Promise<MemberPageableDto> {
    const result = await this.organizationService.getListOfUserOrganizations({
      userId: user.id,
      pagination: paginationQueryToDrizzle(query),
    });

    return new MemberPageableDto({
      items: result.items.map((i) => {
        const session = this.dtoMapper.mapMemberDto(i);

        if (i.organizationId === user.orgId) {
          session.currentOrganization = true;
        } else {
          session.currentOrganization = false;
        }

        return session;
      }),
      count: result.count,
    });
  }

  @ApiOperation({
    summary: 'Create organization',
  })
  @ApiAbstractResponse(CreateOrganizationResponseBodyDto)
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAccessGuard)
  @Post('create')
  async createOrganization(
    @GetUserFromRequest() user: JwtTokenPayload,
    @Body() data: CreateOrganizationRequestBodyDto,
  ): Promise<CreateOrganizationResponseBodyDto> {
    return await this.organizationService.createOrganizationWithOwner({
      userId: user.id,
      ...data,
    });
  }

  // @ApiOperation({
  //   summary: 'Create organization',
  // })
  // @ApiAbstractResponse(CreateOrganizationResponseBodyDto)
  // @ApiBasicAuth('Bearer')
  // @UseGuards(JwtAccessGuard)
  // @Post('create')
  // async getOrganization(
  //   @GetUserFromRequest() user: JwtTokenPayload,
  //   @Body() data: CreateOrganizationRequestBodyDto,
  // ): Promise<CreateOrganizationResponseBodyDto> {
  //   return await this.organizationService.createOrganizationWithOwner({
  //     userId: user.id,
  //     ...data,
  //   });
  // }
}
