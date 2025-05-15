import { Logger } from '@nestjs/common';
import { z } from 'zod';

import { NodeEnvEnum } from '../enums/app.enum';

export const EnvConfigZ = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvEnum).default(NodeEnvEnum.prod),

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

export default (): EnvConfig => {
  const logger = new Logger('EnvConfig');

  console.log(process.env, '<<< env');

  const envConfig = EnvConfigZ.parse({
    ...process.env,

    PORT: +process.env.PORT!,

    JWT_ACCESS_TOKEN_EXPIRES_IN: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN!,
    JWT_REFRESH_TOKEN_EXPIRES_IN: +process.env.JWT_REFRESH_TOKEN_EXPIRES_IN!,

    PROFILE_PICTURE_SIZE: +process.env.PROFILE_PICTURE_SIZE!,

    REDIS_PORT: +process.env.REDIS_PORT!,

    KAFKA_BROKERS: process.env.KAFKA_BROKERS?.split(','),
    KAFKA_FROM_BEGINNING: process.env.KAFKA_FROM_BEGINNING === 'true',

    MINIO_PORT: +process.env.MINIO_PORT!,
  });

  logger.log('Application configuration', envConfig);

  return envConfig;
};
