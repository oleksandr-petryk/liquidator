import * as t from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: t.timestamp('created-at').defaultNow().notNull(),
  updatedAt: t.timestamp('updated-at'),
};
