import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

import { AppModule } from './app.module';
import type { EnvConfig } from './shared/config/configuration';
import {
  APP_GLOBAL_URL_PREFIX,
  APP_OPENAPI_JSON_URL,
  APP_SWAGGER_URL,
} from './shared/const/app';
import { AbstractResponseInterceptor } from './shared/interceptors/abstract-response.interceptor';

async function bootstrap(): Promise<void> {
  const logger = new Logger('NestApplication');

  logger.log('Initialize application');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      ignoreTrailingSlash: true,
      logger: process.env.SERVICE_FASTIFY_LOGGING === 'true',
    }),
  );

  // Get ConfigService to access SERVICE_PORT
  const configService = app.get(ConfigService<EnvConfig>);
  const PORT = configService.getOrThrow<number>('PORT');

  // Middlewares
  logger.log('Setup middlewares');
  app.setGlobalPrefix(APP_GLOBAL_URL_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: false,
      exceptionFactory: (
        validationErrors: ValidationError[] = [],
      ): BadRequestException => {
        return new BadRequestException({
          field: validationErrors[0].property,
          message: Object.values(validationErrors[0].constraints || {}).join(
            ', ',
          ),
        });
      },
    }),
  );
  app.register(fastifyCookie, { parseOptions: {} });
  app.register(fastifySession, {
    secret: randomUUID(), // TODO: research how to safely manage secret
    saveUninitialized: false, // TODO: research it (Don't save uninitialized session)
    cookie: {
      secure: false, // TODO: research it (Use `true` in production with HTTPS)
      maxAge: 1000 * 60, // Session expiration (1 minute in this example)
    },
  });
  app.enableCors();
  app.useGlobalInterceptors(new AbstractResponseInterceptor());

  // Read swagger-dark-mode.css file for Swagger UI dark mode
  logger.log('Read swagger-dark-mode.css');
  const darkModeCSS = readFileSync(
    join(process.cwd(), 'misc', 'swagger-dark-mode.css'),
    'utf-8',
  );

  // Swagger
  logger.log('Setup swagger');
  const swaggerOptions: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };
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
    .setVersion('0.1.0')
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

  await app.listen(
    PORT,
    // required to work in docker container
    // https://fastify.dev/docs/latest/Guides/Getting-Started/#note
    '0.0.0.0',
  );

  logger.log(`Swagger UI http://localhost:${PORT}/${APP_OPENAPI_JSON_URL}`);
  logger.log(
    `Application started on http://localhost:${PORT}/${APP_GLOBAL_URL_PREFIX}`,
  );
}

bootstrap();
