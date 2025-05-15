import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';
import configuration from './shared/config/configuration';
import { DrizzleModule } from './shared/modules/drizzle/drizzle.module';
import { KafkaModule } from './shared/modules/kafka/kafka.module';
import { PgModule } from './shared/modules/pg/pg.module';
import { RedisModule } from './shared/modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    AuthModule,
    DrizzleModule,
    KafkaModule,
    PgModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
