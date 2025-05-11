import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { timestamps } from './timestamps';
import { primaryKey } from './primaryKey';

export const picture = pgTable('pictures', {
  ...primaryKey,
  picture: t.varchar({ length: 256 }).notNull(),
  ...timestamps,
});
