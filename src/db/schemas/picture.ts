import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { primaryKey } from './primaryKey';
import { timestamps } from './timestamps';

export const picture = pgTable('pictures', {
  ...primaryKey,
  picture: t.varchar({ length: 256 }).notNull(),
  ...timestamps,
});
