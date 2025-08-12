import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { randomUUID } from 'crypto';
import {
  Consumer,
  EachMessagePayload,
  Kafka,
  Partitioners,
  Producer,
} from 'kafkajs';

import { EnvConfig } from '../../5_shared/config/configuration';
import { NodeEnvEnum } from '../../5_shared/enums/app.enum';
import { KafkaController, KafkaOnMessage } from './kafka.decorator';

export interface KafkaServiceMessageHandlerOptions {
  method: (message: EachMessagePayload) => Promise<void>;
  topic: string;
}

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);
  private readonly clientId = 'liquidator';
  private kafka: Kafka;
  readonly fromBeginning: boolean;
  readonly consumer: Consumer;
  readonly producer: Producer;
  private consumers!: Array<KafkaServiceMessageHandlerOptions>;
  private topicToHandler: Map<
    string,
    KafkaServiceMessageHandlerOptions['method']
  >;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.fromBeginning = this.configService.getOrThrow('KAFKA_FROM_BEGINNING');
    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.configService.getOrThrow('KAFKA_BROKERS'),
      connectionTimeout: 5_000,
      // enforceRequestTimeout: false,
      // logLevel: 1,
    });
    this.consumer = this.kafka.consumer({
      groupId: this.createGroupId(),
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    this.topicToHandler = new Map();
  }

  async onModuleInit(): Promise<void> {
    await this.initializeKafkaConnections();
    await this.initializeMessageHandlers();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnectKafkaConnections();
  }

  /**
   * Create group ID to prevent rebalancing
   * Read more https://github.com/tulios/kafkajs/issues/807#issuecomment-787764480
   * @returns group ID
   */
  private createGroupId(): string {
    const NODE_ENV = this.configService.getOrThrow<NodeEnvEnum>('NODE_ENV');
    const groupId = `${this.clientId}-customer`;

    // If it is test or local run add random UUID to prevent Kafka rebalancing
    return [NodeEnvEnum.test, NodeEnvEnum.local].includes(NODE_ENV)
      ? groupId + `-${randomUUID()}`
      : groupId;
  }

  private async initializeKafkaConnections(): Promise<void> {
    try {
      await Promise.all([this.consumer.connect(), this.producer.connect()]);
      this.logger.log('Kafka consumer and producer connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect Kafka consumer or producer', error);
      throw error;
    }
  }

  private async initializeMessageHandlers(): Promise<void> {
    // Get consumers added with @KafkaOnMessage decorator
    this.consumers = this.getMessageHandlers();

    // Fill out Map data structure for fast method access
    this.consumers.map((i) => {
      this.topicToHandler.set(i.topic, i.method);
    });

    // Subscribe to all topics
    await Promise.all(
      this.consumers.map(({ topic }) => this.subscribeToTopic(topic)),
    );

    // Create message handler
    await this.consumer.run({
      eachMessage: async (payload) => {
        this.logger.log(`Processing message from topic: "${payload.topic}"`);
        const method = this.topicToHandler.get(payload.topic);

        try {
          if (!method) {
            throw Error('Method should not be "undefined"');
          }

          await method(payload);
        } catch (error) {
          this.logger.error(
            `Error processing message from topic ${payload.topic}; method: ${method?.name}`,
            error,
          );
        }
      },
    });
  }

  private async subscribeToTopic(topic: string): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic,
        fromBeginning: this.fromBeginning,
      });
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic ${topic}`, error);
    }
  }
  private async disconnectKafkaConnections(): Promise<void> {
    try {
      await Promise.all([
        this.consumer.disconnect(),
        this.producer.disconnect(),
      ]);
      this.logger.log('Kafka consumer and producer disconnected successfully');
    } catch (error) {
      this.logger.error(
        'Failed to disconnect Kafka consumer or producer',
        error,
      );
    }
  }
  private getMessageHandlers(): KafkaServiceMessageHandlerOptions[] {
    return this.discoveryService
      .getControllers({ metadataKey: KafkaController.KEY })
      .flatMap((wrapper) => {
        const { instance } = wrapper;
        return this.metadataScanner
          .getAllMethodNames(instance)
          .map((methodName) => {
            const topic = this.discoveryService.getMetadataByDecorator(
              KafkaOnMessage,
              wrapper,
              methodName,
            );
            if (!topic) return null;
            return {
              method: instance[methodName].bind(instance),
              topic,
            };
          })
          .filter((handler): handler is KafkaServiceMessageHandlerOptions =>
            Boolean(handler),
          );
      });
  }
}
