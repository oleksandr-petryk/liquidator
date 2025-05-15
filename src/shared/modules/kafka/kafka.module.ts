import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { KafkaService } from './kafka.service';

@Global()
@Module({
  providers: [KafkaService],
  imports: [DiscoveryModule],
  exports: [KafkaService],
})
export class KafkaModule {}
