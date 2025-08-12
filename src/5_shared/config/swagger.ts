import type { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  type OpenAPIObject,
  type SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { PinoLogger } from 'nestjs-pino';
import * as path from 'path';

import { EnvConfig } from './configuration';
import { SWAGGER_TAGS } from './const/swagger.const';

/**
 * Setup Swagger
 */
export async function setupSwagger({
  app,
  configService,
  logger,
}: {
  app: NestFastifyApplication;
  configService: ConfigService<EnvConfig>;
  logger: PinoLogger;
}): Promise<void> {
  logger.info('Setup swagger');

  const APP_VERSION = configService.getOrThrow<string>('APP_VERSION');
  const APP_SWAGGER_URL = configService.getOrThrow<string>('APP_SWAGGER_URL');
  const APP_OPENAPI_JSON_URL = configService.getOrThrow<string>(
    'APP_OPENAPI_JSON_URL',
  );
  const PORT = configService.getOrThrow<number>('PORT');

  const swaggerOptions: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };

  // Read swagger-dark-mode.css file for Swagger UI dark mode
  const darkModeCSS = await readFile(
    path.join(
      process.cwd(),
      'src',
      '5_shared',
      'misc',
      'swagger-dark-mode.css',
    ),
    'utf-8',
  );

  const config = new DocumentBuilder()
    .setTitle('Liquidator API')
    .setDescription('Liquidator API documentation')
    .setExternalDoc('openapi.json', APP_OPENAPI_JSON_URL)
    .addServer('', 'Default (Current URL)')
    .addServer(`http://localhost:${PORT}/`, 'Local')
    .addSecurity('Bearer', {
      type: 'http',
      scheme: 'Bearer',
    })
    .setVersion(APP_VERSION)
    .addTag(SWAGGER_TAGS.platform.title, SWAGGER_TAGS.platform.description)
    .addTag(SWAGGER_TAGS.auth.title)
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    config,
    swaggerOptions,
  );

  // Modify swaggerDocument to update paths (add trailing slash)
  const modifiedSwaggerDocument: OpenAPIObject = {
    ...swaggerDocument,
    paths: Object.fromEntries(
      Object.entries(swaggerDocument.paths).map(([path, methods]) => [
        path.endsWith('/') ? path : `${path}/`,
        methods,
      ]),
    ),
  };

  SwaggerModule.setup(APP_SWAGGER_URL, app, modifiedSwaggerDocument, {
    customCss: darkModeCSS,
    jsonDocumentUrl: APP_OPENAPI_JSON_URL,
  });
}
