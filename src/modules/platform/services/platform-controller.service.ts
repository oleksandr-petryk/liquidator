import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import type { EnvConfig } from '../../../shared/config/configuration';
import type {
  GetAppVersionResponseBodyDto,
  GetHealthResponseBodyDto,
} from '../../../shared/dto/controllers/app/response-body.dto';

/**
 * Platform service
 */
@Injectable()
export class PlatformControllerService {
  private appVersion: string;
  private appHealth: string;

  constructor(
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.appVersion = this.configService.getOrThrow('APP_VERSION');
    this.appHealth = this.configService.getOrThrow('APP_HEALTH_LIVE');
  }

  /**
   * Get application health
   * @returns live
   */
  getHealth(): GetHealthResponseBodyDto {
    return {
      status: this.appHealth,
    };
  }

  /**
   * Get application version
   * @returns version
   */
  getVersion(): GetAppVersionResponseBodyDto {
    return {
      version: this.appVersion,
    };
  }
}
