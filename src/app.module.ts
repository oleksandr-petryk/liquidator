import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './modules/auth/auth.module';
import { PlatformModule } from './modules/platform/platform.module';
import { S3Module } from './modules/s3/s3.module';
import { configurationLoader } from './shared/config/configuration';
import { DrizzleModule } from './shared/modules/drizzle/drizzle.module';
import { KafkaModule } from './shared/modules/kafka/kafka.module';
import { PgModule } from './shared/modules/pg/pg.module';
import { RedisModule } from './shared/modules/redis/redis.module';

const DEFAULT_MODULES = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configurationLoader],
    envFilePath: '.env',
  }),
  LoggerModule.forRoot({
    pinoHttp: {
      level: process.env.LOG_LEVEL || 'debug',
      redact: ['request.headers.authorization'],
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
          levelFirst: false,
          translateTime: "yyyy-MM-dd'T'HH:mm:ss.l'Z'",
          messageFormat: '{req.id} [{context}] {msg}',
          ignore: 'pid,hostname,context,req,res',
          errorLikeObjectKeys: ['err', 'error'],
        },
      },
    },
  }),
];

@Module({
  imports: [
    ...DEFAULT_MODULES,
    AuthModule,
    DrizzleModule,
    KafkaModule,
    PgModule,
    PlatformModule,
    RedisModule,
    S3Module,
  ],
})
export class AppModule {}
