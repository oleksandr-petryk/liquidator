import { z } from 'zod';

import {
  APP_DEFAULT_GLOBAL_URL_PREFIX,
  APP_DEFAULT_OPENAPI_JSON_URL,
  APP_DEFAULT_SWAGGER_URL,
  APP_DEFAULT_VERSION,
  APP_HEALTH_LIVE,
} from '../const/app.const';
import { NodeEnvEnum } from '../enums/app.enum';

export const EnvConfigZ = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvEnum).default(NodeEnvEnum.prod),

  EMAIL_FROM: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string().transform((value) => +value),
  EMAIL_SECURE: z.string().transform((value) => value === 'true'),

  APP_HEALTH_LIVE: z.string(),
  APP_VERSION: z.string(),
  APP_GLOBAL_URL_PREFIX: z.string(),
  APP_SWAGGER_URL: z.string(),
  APP_OPENAPI_JSON_URL: z.string(),

  S3_ENDPOINT: z.string(),
  S3_REGION: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),

  PORT: z.number().transform((value) => +value),

  JWT_ACCESS_KEY_PRIVATE: z.string(),
  JWT_ACCESS_KEY_PUBLIC: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.number().transform((value) => +value),

  JWT_REFRESH_KEY_PRIVATE: z.string(),
  JWT_REFRESH_KEY_PUBLIC: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.number().transform((value) => +value),

  PROFILE_PICTURE_SIZE: z.number(),

  POSTGRES_DB_URI: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.number().transform((value) => +value),

  KAFKA_BROKERS: z.array(z.string()),
  KAFKA_FROM_BEGINNING: z.boolean().default(true),
});

export type EnvConfig = z.infer<typeof EnvConfigZ>;

export function configurationLoader(): EnvConfig {
  const envConfig = EnvConfigZ.parse({
    ...process.env,

    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_SECURE: process.env.EMAIL_SECURE,

    APP_VERSION: process.env.APP_VERSION || APP_DEFAULT_VERSION,
    APP_HEALTH_LIVE: process.env.APP_HEALTH_LIVE || APP_HEALTH_LIVE,
    APP_GLOBAL_URL_PREFIX:
      process.env.APP_GLOBAL_URL_PREFIX || APP_DEFAULT_GLOBAL_URL_PREFIX,
    APP_SWAGGER_URL: process.env.APP_SWAGGER_URL || APP_DEFAULT_SWAGGER_URL,
    APP_OPENAPI_JSON_URL:
      process.env.APP_OPENAPI_JSON_URL || APP_DEFAULT_OPENAPI_JSON_URL,

    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,

    PORT: +process.env.PORT!,

    JWT_ACCESS_TOKEN_EXPIRES_IN: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN!,
    JWT_REFRESH_TOKEN_EXPIRES_IN: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN!,

    PROFILE_PICTURE_SIZE: +process.env.PROFILE_PICTURE_SIZE!,

    REDIS_PORT: +process.env.REDIS_PORT!,

    KAFKA_BROKERS: process.env.KAFKA_BROKERS?.split(','),
    KAFKA_FROM_BEGINNING: process.env.KAFKA_FROM_BEGINNING === 'true',
  });

  return envConfig;
}
