import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (): Redis => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
    RedisService,
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}
