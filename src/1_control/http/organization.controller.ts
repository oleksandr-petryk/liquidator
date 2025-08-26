import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { OrganizationService } from '../../2_service/organization/organization.service';
import { SWAGGER_TAGS } from '../../5_shared/config/const/swagger.const';
import { ApiAbstractResponse } from '../../5_shared/decorators/api-abstract-response.decorator';

@ApiTags(SWAGGER_TAGS.organization.title)
@Controller()
export class PlatformController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly organizationService: OrganizationService,
  ) {}

  @Post(':id/token')
  async getOrganizationToken(
    @Param('id') organizationId: string,
  ): Promise<void> {
    await this.organizationService.getTokenOrganization();
  }
}
