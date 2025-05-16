import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { applyMiddlewares } from './middlewares';
import type { EnvConfig } from './shared/config/configuration';
import { setupSwagger } from './swagger';

/**
 * Startup Nest.js application
 */
async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  logger.log('Initialize application');

  // Create Nest.js application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      ignoreTrailingSlash: true,
      logger: process.env.SERVICE_FASTIFY_LOGGING === 'true', // TODO: apply pino logger
    }),
  );

  // Get ConfigService
  const configService = app.get(ConfigService<EnvConfig>);
  const PORT = configService.getOrThrow<number>('PORT');
  const APP_GLOBAL_URL_PREFIX = configService.getOrThrow<number>(
    'APP_GLOBAL_URL_PREFIX',
  );
  const APP_SWAGGER_URL = configService.getOrThrow('APP_SWAGGER_URL');
  const APP_OPENAPI_JSON_URL = configService.getOrThrow('APP_OPENAPI_JSON_URL');

  // Apply middlewares
  applyMiddlewares({ app, configService, logger });

  // Setup Swagger
  await setupSwagger({ app, configService, logger });

  // Start server
  await app.listen(
    PORT,
    // It is required to work in docker container: https://fastify.dev/docs/latest/Guides/Getting-Started/#note
    '0.0.0.0',
  );

  // Log basic URLs
  logger.log(`Swagger UI http://localhost:${PORT}/${APP_SWAGGER_URL}`);
  logger.log(`openapi.json http://localhost:${PORT}/${APP_OPENAPI_JSON_URL}`);
  logger.log(
    `App started on http://localhost:${PORT}/${APP_GLOBAL_URL_PREFIX}`,
  );
}

bootstrap();
