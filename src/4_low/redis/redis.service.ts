import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { EnvConfig } from '../../5_shared/config/configuration';
import { APP_DEFAULT_TTL } from '../../5_shared/config/const/app.const';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject('REDIS_CLIENT')
    public readonly redis: Redis,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }

  async setValue({
    key,
    value,
    ttl = APP_DEFAULT_TTL,
  }: {
    key: string;
    value: string;
    ttl?: number;
  }): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async getValue({ key }: { key: string }): Promise<string | null> {
    return await this.redis.get(key);
  }

  async deleteValue({ key }: { key: string }): Promise<void> {
    await this.redis.del(key);
  }
}
