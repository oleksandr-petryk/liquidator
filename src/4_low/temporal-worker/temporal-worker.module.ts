// import process from 'node:process';
//
// import { Global, Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { NativeConnection, Worker } from '@temporalio/worker';
// import { PinoLogger } from 'nestjs-pino';
//
// import * as activities from '../../1_control/workflows/auth.activities';
// import { EnvConfig } from '../../5_shared/config/configuration';
// import { APP_TEMPORAL_WORKER_TASK_QUEUE } from '../../5_shared/config/const/app.const';
//
// const TEMPORAL_WORKER = 'POSTGRES_CONNECTION';
//
// @Global()
// @Module({
//   providers: [
//     {
//       provide: TEMPORAL_WORKER,
//       inject: [ConfigService, PinoLogger],
//       useFactory: async (
//         configService: ConfigService<EnvConfig>,
//         logger: PinoLogger,
//       ): Promise<void> => {
//         logger.setContext(TemporalWorkerModule.name);
//
//         const address = configService.getOrThrow('TEMPORAL_ADDRESS');
//         const namespace = configService.getOrThrow('TEMPORAL_NAMESPACE');
//         const apiKey = configService.get('TEMPORAL_API_KEY');
//
//         const connection = await NativeConnection.connect({
//           address,
//           apiKey,
//         });
//
//         const worker = await Worker.create({
//           connection,
//           namespace,
//           taskQueue: APP_TEMPORAL_WORKER_TASK_QUEUE,
//           workflowsPath: require.resolve(
//             '../../1_control/workflows/auth.workflow',
//           ),
//           activities,
//         });
//
//         worker.run().catch(async (err) => {
//           await connection.close();
//           logger.error('Could not start worker', err);
//           process.exit(1);
//         });
//
//         logger.info(
//           `Worker started: address: ${address}, namespace: ${namespace}`,
//         );
//       },
//     },
//   ],
//   imports: [ConfigModule],
// })
// export class TemporalWorkerModule {}
