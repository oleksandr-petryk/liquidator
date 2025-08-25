import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';

export const permission = pgTable('permission', {
  ...drizzlePrimaryKey,
  action: varchar().notNull(),
  ...drizzleTimestamps,
});
