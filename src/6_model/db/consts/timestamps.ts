import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

export const drizzleTimestamps = {
  createdAt: t
    .timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP AT TIME ZONE 'UTC'`)
    .notNull(),
  updatedAt: t.timestamp('updated_at'),
};
