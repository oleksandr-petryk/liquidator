import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SWAGGER_TAGS } from '../../shared/const/swagger.const';
import { ApiAbstractResponse } from '../../shared/decorators/api-abstract-response.decorator';
import {
  GetAppVersionResponseBodyDto,
  GetHealthResponseBodyDto,
} from '../../shared/dto/app/response.dto';
import { PlatformControllerService } from './services/platform-controller.service';

/**
 * Basic platform endpoints
 *
 * - health
 * - version
 */
@ApiTags(SWAGGER_TAGS.platform.title)
@Controller()
export class PlatformController {
  constructor(private readonly appService: PlatformControllerService) {}

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
    return this.appService.getVersion();
  }
}
