import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';

@Module({
  controllers: [PlatformController],
  providers: [PlatformService],
  imports: [ConfigModule],
})
export class PlatformModule {}
