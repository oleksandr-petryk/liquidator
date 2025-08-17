import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';

export const clientFingerprint = pgTable('client_fingerprint', {
  ...drizzlePrimaryKey,
  userAgent: varchar('user_agent'),
  ip: varchar('user_id').notNull(),
  ...drizzleTimestamps,
});
