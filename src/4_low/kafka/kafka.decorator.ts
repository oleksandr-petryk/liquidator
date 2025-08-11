import { DiscoveryService } from '@nestjs/core';

export const KafkaController = DiscoveryService.createDecorator<string>();
export const KafkaOnMessage = DiscoveryService.createDecorator<string>();
