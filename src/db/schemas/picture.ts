import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { timestamps } from './timestamps';

export const picture = pgTable('pictures', {
  id: t.uuid().defaultRandom(),
  picture: t.varchar().notNull(),
  ...timestamps,
});
