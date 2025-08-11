import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors';
import fastifyMultipart, { FastifyMultipartOptions } from '@fastify/multipart';
import fastifySession, { FastifySessionOptions } from '@fastify/session';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest, RawServerDefault } from 'fastify';
import { PinoLogger } from 'nestjs-pino';

import { AbstractResponseInterceptor } from '../interceptors/abstract-response.interceptor';
import { EnvConfig } from './configuration';

/**
 * Apply middlewares
 * - global prefix
 * - cookie
 * - session
 * - cors
 * - abstract response interceptor
 * - validation pipe
 */
export async function applyMiddlewares({
  app,
  configService,
  logger,
}: {
  app: NestFastifyApplication<RawServerDefault>;
  configService: ConfigService<EnvConfig>;
  logger: PinoLogger;
}): Promise<void> {
  logger.info('Setup middlewares');

  const APP_GLOBAL_URL_PREFIX = configService.getOrThrow(
    'APP_GLOBAL_URL_PREFIX',
  );

  // Global URL prefix
  app.setGlobalPrefix(APP_GLOBAL_URL_PREFIX);

  // Fastify middlewares
  await app.register(fastifyCors, {
    origin: '*',
    credentials: false, // must be false when origin is '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  } satisfies FastifyCorsOptions);
  await app.register(fastifyCookie, {
    parseOptions: {},
  } satisfies FastifyCookieOptions);
  await app.register(fastifySession, {
    secret: randomUUID(), // TODO: research how to safely manage secret
    saveUninitialized: false, // TODO: research it (Don't save uninitialized session)
    cookie: {
      secure: false, // TODO: research it (Use `true` in production with HTTPS)
      maxAge: 1000 * 60, // Session expiration (1 minute in this example)
    },
  } satisfies FastifySessionOptions);
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 100 * 1024 * 1024, // TODO: move it to const and env config
    },
  } satisfies FastifyMultipartOptions);
  app.use((req: FastifyRequest, res: FastifyReply, next: any) => {
    const headerId = req.headers['x-correlation-id'];
    const correlationId =
      typeof headerId === 'string' ? headerId : randomUUID();
    req.headers['x-correlation-id'] = correlationId;
    (req as any).correlationId = correlationId;
    next();
  });

  // Interceptors
  app.useGlobalInterceptors(new AbstractResponseInterceptor());

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validationError: {
        value: true,
      },
      validateCustomDecorators: true,
      // disableErrorMessages: false,
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

  // Others
  app.enableShutdownHooks();
}
