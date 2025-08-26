import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { OrganizationService } from '../../2_service/organization/organization.service';
import { SWAGGER_TAGS } from '../../5_shared/config/const/swagger.const';
import { ApiAbstractResponse } from '../../5_shared/decorators/api-abstract-response.decorator';
import { GetUserFromRequest } from '../../5_shared/decorators/get-user-from-request.decorator';
import { JwtTokenPayload } from '../../5_shared/interfaces/jwt-token.interface';
import { LoginResponseBodyDto } from '../../6_model/dto/io/auth/response-body.dto';

@ApiTags(SWAGGER_TAGS.organization.title)
@Controller()
export class PlatformController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly organizationService: OrganizationService,
  ) {}

  @ApiOperation({
    summary: 'Log-in',
  })
  @ApiAbstractResponse(LoginResponseBodyDto)
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
}
