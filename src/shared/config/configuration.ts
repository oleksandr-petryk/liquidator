import { z } from 'zod';

import {
  APP_DEFAULT_GLOBAL_URL_PREFIX,
  APP_DEFAULT_OPENAPI_JSON_URL,
  APP_DEFAULT_SWAGGER_URL,
  APP_DEFAULT_VERSION,
} from '../const/app.const';
import { NodeEnvEnum } from '../enums/app.enum';

export const EnvConfigZ = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvEnum).default(NodeEnvEnum.prod),

  APP_VERSION: z.string(),
  APP_GLOBAL_URL_PREFIX: z.string(),
  APP_SWAGGER_URL: z.string(),
  APP_OPENAPI_JSON_URL: z.string(),

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

  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.number().transform((value) => +value),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
});

export type EnvConfig = z.infer<typeof EnvConfigZ>;

export function configurationLoader(): EnvConfig {
  const envConfig = EnvConfigZ.parse({
    ...process.env,

    APP_VERSION: process.env.APP_VERSION || APP_DEFAULT_VERSION,
    APP_GLOBAL_URL_PREFIX:
      process.env.APP_GLOBAL_URL_PREFIX || APP_DEFAULT_GLOBAL_URL_PREFIX,
    APP_SWAGGER_URL: process.env.APP_SWAGGER_URL || APP_DEFAULT_SWAGGER_URL,
    APP_OPENAPI_JSON_URL:
      process.env.APP_OPENAPI_JSON_URL || APP_DEFAULT_OPENAPI_JSON_URL,

    PORT: +process.env.PORT!,

    JWT_ACCESS_TOKEN_EXPIRES_IN: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN!,
    JWT_REFRESH_TOKEN_EXPIRES_IN: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN!,

    PROFILE_PICTURE_SIZE: +process.env.PROFILE_PICTURE_SIZE!,

    REDIS_PORT: +process.env.REDIS_PORT!,

    KAFKA_BROKERS: process.env.KAFKA_BROKERS?.split(','),
    KAFKA_FROM_BEGINNING: process.env.KAFKA_FROM_BEGINNING === 'true',

    MINIO_PORT: +process.env.MINIO_PORT!,
  });

  return envConfig;
}
