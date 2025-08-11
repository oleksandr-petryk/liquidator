import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';

export const picture = pgTable('pictures', {
  ...drizzlePrimaryKey,
  picture: t.varchar({ length: 256 }).notNull(),
  ...drizzleTimestamps,
});
