import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { PlatformControllerService } from '../../2_service/platform/platform-controller.service';
import { SWAGGER_TAGS } from '../../5_shared/config/const/swagger.const';
import { ApiAbstractResponse } from '../../5_shared/decorators/api-abstract-response.decorator';
import {
  GetAppVersionResponseBodyDto,
  GetHealthResponseBodyDto,
} from '../../6_model/dto/io/app/response-body.dto';

/**
 * Basic platform endpoints
 *
 * - health
 * - version
 */
@ApiTags(SWAGGER_TAGS.platform.title)
@Controller()
export class PlatformController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly appService: PlatformControllerService,
  ) {}

  /**
   * Get application health status
   * @returns live
   */
  @ApiOperation({
    summary: 'Application health status',
  })
  @ApiAbstractResponse(GetHealthResponseBodyDto)
  @Get('health')
  getHealth(): GetHealthResponseBodyDto {
    this.logger.info(`${this.getHealth.name}`);

    return this.appService.getHealth();
  }

  /**
   * Get application version
   * @returns version
   */
  @ApiOperation({
    summary: 'Application version',
  })
  @ApiAbstractResponse(GetAppVersionResponseBodyDto)
  @Get('version')
  getVersion(): GetAppVersionResponseBodyDto {
    this.logger.info(`${this.getVersion.name}`);

    return this.appService.getVersion();
  }
}
