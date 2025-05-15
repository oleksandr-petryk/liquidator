import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const POSTGRES_CONNECTION = 'POSTGRES_CONNECTION';
export const CONNECT_TIMEOUT_IN_SECONDS = 30;
export const IDLE_CONNECTION_TIMEOUT_IN_SECONDS = 10;

@Global()
@Module({
  providers: [
    {
      provide: POSTGRES_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Pool> => {
        const pool = new Pool({
          connectionString: configService.get<string>('POSTGRES_DB_URI'),
          // ssl: true,
          // connectionTimeoutMillis: CONNECT_TIMEOUT_IN_SECONDS,
        });

        const client = await pool.connect();

        await client.query('select 1');

        client.release();

        return pool;
      },
    },
  ],
  imports: [ConfigModule],
  exports: [POSTGRES_CONNECTION],
})
export class PgModule {}
