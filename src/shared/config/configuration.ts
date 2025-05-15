import { Logger } from '@nestjs/common';
import { z } from 'zod';

import { NodeEnvEnum } from '../enums/app.enum';

export const EnvConfigZ = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvEnum).default(NodeEnvEnum.prod),

  PORT: z.number(),

  JWT_ACCESS_KEY_PRIVATE: z.string(),
  JWT_ACCESS_KEY_PUBLIC: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.number(),
  JWT_REFRESH_KEY_PRIVATE: z.string(),
  JWT_REFRESH_KEY_PUBLIC: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.number(),

  PROFILE_PICTURE_SIZE: z.number(),

  POSTGRES_DB_URI: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.number(),

  KAFKA_BROKERS: z.array(z.string()),
  KAFKA_FROM_BEGINNING: z.boolean().default(true),

  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.number(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
});

export type EnvConfig = z.infer<typeof EnvConfigZ>;

export default (): EnvConfig => {
  const logger = new Logger('EnvConfig');

  const envConfig = EnvConfigZ.parse(process.env);

  logger.log('Application configuration', envConfig);

  return envConfig;
};
