import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { timestamps } from './timestamps';
import { id } from './id';

export const picture = pgTable('pictures', {
  ...id,
  picture: t.varchar({ length: 256 }).notNull(),
  ...timestamps,
});
