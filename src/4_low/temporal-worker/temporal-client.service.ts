import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Connection } from '@temporalio/client';

import { EnvConfig } from '../../5_shared/config/configuration';

@Injectable()
export class TemporalClientService implements OnModuleDestroy, OnModuleDestroy {
  private client!: Client;

  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  async onModuleInit(): Promise<void> {
    const address = this.configService.getOrThrow('TEMPORAL_ADDRESS');
    const namespace = this.configService.getOrThrow('TEMPORAL_NAMESPACE');

    const connection = await Connection.connect({ address });

    this.client = new Client({
      connection,
      namespace,
    });
  }

  async onModuleDestroy(): Promise<void> {}
}
