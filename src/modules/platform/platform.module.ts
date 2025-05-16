import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlatformController } from './platform.controller';
import { PlatformControllerService } from './services/platform-controller.service';

@Module({
  controllers: [PlatformController],
  providers: [PlatformControllerService],
  imports: [ConfigModule],
})
export class PlatformModule {}
