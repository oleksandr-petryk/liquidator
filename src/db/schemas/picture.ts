import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { timestamps } from './timestamps';

export const picture = pgTable('pictures', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  picture: t.varchar().notNull(),
  ...timestamps,
});
