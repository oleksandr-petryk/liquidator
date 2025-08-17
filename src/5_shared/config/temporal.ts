import process from 'node:process';

import type { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { NativeConnection, Worker } from '@temporalio/worker';
import { PinoLogger } from 'nestjs-pino';

import * as activities from '../../1_control/workflows/user-registration.activities';
import { setupUserRegistrationActivities } from '../../1_control/workflows/user-registration.activities';
import { EnvConfig } from './configuration';
import { APP_TEMPORAL_WORKER_TASK_QUEUE } from './const/app.const';

export async function setupTemporal({
  app,
  configService,
  logger,
}: {
  app: NestFastifyApplication;
  configService: ConfigService<EnvConfig>;
  logger: PinoLogger;
}): Promise<void> {
  const address = configService.getOrThrow('TEMPORAL_ADDRESS');
  const namespace = configService.getOrThrow('TEMPORAL_NAMESPACE');
  const apiKey = configService.get('TEMPORAL_API_KEY');

  const connection = await NativeConnection.connect({
    address,
    apiKey,
  });

  setupUserRegistrationActivities(app);

  const worker = await Worker.create({
    connection,
    namespace,
    taskQueue: APP_TEMPORAL_WORKER_TASK_QUEUE,
    workflowsPath: require.resolve(
      '../../1_control/workflows/user-registration.workflow',
    ),
    activities,
  });

  worker.run().catch(async (err) => {
    await connection.close();
    logger.error('Could not start worker', err);
    process.exit(1);
  });

  logger.info(`Worker started: address: ${address}, namespace: ${namespace}`);
}
