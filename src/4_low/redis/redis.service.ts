import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { EnvConfig } from '../../5_shared/config/configuration';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly redis: Redis;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const host = this.configService.getOrThrow('REDIS_HOST');
    const port = this.configService.getOrThrow('REDIS_PORT');

    this.redis = new Redis(`${host}:${port}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}
