import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AccountVerificationModule } from './2_service/account-verification/account-verification.module';
import { ActivityLogModule } from './2_service/activity-log/activity-log.module';
import { AuthModule } from './2_service/auth/auth.module';
import { ClientFingerprintModule } from './2_service/client-fingerprint/client-fingerprint.module';
import { PasswordResetRequestModule } from './2_service/password-reset-request/password-reset-request.module';
import { PictureModule } from './2_service/picture/picture.module';
import { PlatformModule } from './2_service/platform/platform.module';
import { SessionModule } from './2_service/session/session.module';
import { UserModule } from './2_service/user/user.module';
import { DaoModule } from './3_components/dao/dao.module';
import { HandlebarsModule } from './3_components/handlebars/handlebars.module';
import { MailModule } from './3_components/mail/mail.module';
import { S3Module } from './3_components/s3/s3.module';
import { DrizzleModule } from './4_low/drizzle/drizzle.module';
import { KafkaModule } from './4_low/kafka/kafka.module';
import { PgModule } from './4_low/pg/pg.module';
import { RedisModule } from './4_low/redis/redis.module';
import { configurationLoader } from './5_shared/config/configuration';

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
    ActivityLogModule,
    ClientFingerprintModule,
    DrizzleModule,
    KafkaModule,
    PgModule,
    PlatformModule,
    RedisModule,
    S3Module,
    PictureModule,
    MailModule,
    HandlebarsModule,
    AccountVerificationModule,
    PasswordResetRequestModule,
    UserModule,
    SessionModule,
    DaoModule,
  ],
})
export class AppModule {}
