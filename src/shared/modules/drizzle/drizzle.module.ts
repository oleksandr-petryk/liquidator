import { Global, Module } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import { PgModule, POSTGRES_CONNECTION } from '../pg/pg.module';
import * as schema from './schemas';

export type Drizzle = NodePgDatabase<typeof schema>;
export const DRIZZLE_CONNECTION = 'DRIZZLE_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_CONNECTION,
      inject: [POSTGRES_CONNECTION],
      useFactory: async (pg: Client): Promise<Drizzle> => {
        const orm = drizzle(pg, { schema });

        await orm.execute(sql`select 1`);

        return orm;
      },
    },
  ],
  imports: [PgModule],
  exports: [DRIZZLE_CONNECTION],
})
export class DrizzleModule {}
