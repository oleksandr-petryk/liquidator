import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@temporalio/client';
import { NativeConnection } from '@temporalio/worker';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class TemporalService implements OnModuleInit {
  private client!: Client;
  private readonly clientReadyPromise!: Promise<Client>;
  private resolveClient!: (client: Client) => void;

  constructor(
    private readonly configService: ConfigService,
    @InjectPinoLogger(TemporalService.name)
    private readonly logger: PinoLogger,
  ) {
    this.clientReadyPromise = new Promise((resolve) => {
      this.resolveClient = resolve;
    });
  }

  async onModuleInit(): Promise<void> {
    const address = this.configService.getOrThrow('TEMPORAL_ADDRESS');
    const namespace = this.configService.getOrThrow('TEMPORAL_NAMESPACE');

    const connection = await NativeConnection.connect({ address });
    this.client = new Client({ connection, namespace });
    this.resolveClient(this.client);

    this.logger.debug(
      `Connected to Temporal at address: ${address} namespace: ${namespace}`,
    );
  }

  /**
   * Get temporal client
   */
  async getClient(): Promise<Client> {
    return await this.clientReadyPromise;
  }
}
