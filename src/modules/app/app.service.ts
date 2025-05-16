import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { EnvConfig } from '../../shared/config/configuration';
import { APP_HEALTH_LIVE } from '../../shared/const/app.const';
import type {
  GetAppVersionResponseBodyDto,
  GetHealthResponseBodyDto,
} from '../../shared/dto/app/response.dto';

/**
 * Application service
 */
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  /**
   * Get application health
   * @returns live
   */
  getHealth(): GetHealthResponseBodyDto {
    return {
      status: APP_HEALTH_LIVE,
    };
  }

  /**
   * Get application version
   * @returns version
   */
  getVersion(): GetAppVersionResponseBodyDto {
    return {
      version: this.configService.getOrThrow('APP_VERSION'),
    };
  }
}
