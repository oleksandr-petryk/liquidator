import * as t from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: t.timestamp('created_at').defaultNow().notNull(),
  updatedAt: t.timestamp('updated_at'),
};
