import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlatformController } from '../../1_control/http/platform.controller';
import { PlatformControllerService } from './platform-controller.service';

@Module({
  controllers: [PlatformController],
  providers: [PlatformControllerService],
  imports: [ConfigModule],
})
export class PlatformModule {}
