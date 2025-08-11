import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, PinoLogger } from 'nestjs-pino';

import type { EnvConfig } from './5_shared/config/configuration';
import { applyMiddlewares } from './5_shared/config/middlewares';
import { setupSwagger } from './5_shared/config/swagger';
import { AppModule } from './app.module';

/**
 * Startup Nest.js application
 */
async function bootstrap(): Promise<void> {
  // Create Nest.js application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      ignoreTrailingSlash: true,
      logger: process.env.SERVICE_FASTIFY_LOGGING === 'true', // TODO: apply pino logger
    }),
    {
      bufferLogs: true,
    },
  );

  // Use Pino logger
  app.useLogger(app.get(Logger));

  const logger = await app.resolve<PinoLogger>(PinoLogger);
  logger.setContext('Bootstrap');

  const configService = app.get(ConfigService<EnvConfig>);

  // Get required variables
  const PORT = configService.getOrThrow<number>('PORT');
  const APP_GLOBAL_URL_PREFIX = configService.getOrThrow<number>(
    'APP_GLOBAL_URL_PREFIX',
  );
  const APP_SWAGGER_URL = configService.getOrThrow('APP_SWAGGER_URL');
  const APP_OPENAPI_JSON_URL = configService.getOrThrow('APP_OPENAPI_JSON_URL');

  // Apply middlewares
  await applyMiddlewares({ app, configService, logger });

  // Setup Swagger
  await setupSwagger({ app, configService, logger });

  // Start server
  await app.listen(
    PORT,
    // It is required to work in docker container: https://fastify.dev/docs/latest/Guides/Getting-Started/#note
    '0.0.0.0',
  );

  // Log basic URLs
  logger.info(`Swagger UI http://localhost:${PORT}/${APP_SWAGGER_URL}`);
  logger.info(`openapi.json http://localhost:${PORT}/${APP_OPENAPI_JSON_URL}`);
  logger.info(
    `App started on http://localhost:${PORT}/${APP_GLOBAL_URL_PREFIX}`,
  );
}

bootstrap();
