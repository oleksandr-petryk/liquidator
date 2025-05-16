import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { randomUUID } from 'crypto';

import type { EnvConfig } from './shared/config/configuration';
import { AbstractResponseInterceptor } from './shared/interceptors/abstract-response.interceptor';

/**
 * Apply middlewares
 * - global prefix
 * - cookie
 * - session
 * - cors
 * - abstract response interceptor
 * - validation pipe
 */
export function applyMiddlewares({
  app,
  configService,
  logger,
}: {
  app: NestFastifyApplication;
  configService: ConfigService<EnvConfig>;
  logger: Logger;
}): void {
  logger.log('Setup middlewares');

  const APP_GLOBAL_URL_PREFIX = configService.getOrThrow(
    'APP_GLOBAL_URL_PREFIX',
  );

  app.setGlobalPrefix(APP_GLOBAL_URL_PREFIX);
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
}
