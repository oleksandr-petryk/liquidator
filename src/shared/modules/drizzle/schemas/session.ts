import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { user } from './user';

export const session = pgTable('Sessions', {
  ...drizzlePrimaryKey,
  name: t.varchar({ length: 50 }).notNull(),
  userId: t.uuid('user_id').notNull(),
  refreshToken: t.varchar('refresh_token', { length: 500 }).notNull(),
  ...drizzleTimestamps,
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
