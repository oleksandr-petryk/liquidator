import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { user } from './user';

export const session = pgTable('session', {
  ...drizzlePrimaryKey,
  token: varchar('token', { length: 2048 }).notNull(),
  userId: uuid('picture_id')
    .references(() => user.id)
    .notNull(),
  name: varchar('name', { length: 128 }),
  expiresAt: timestamp('expires_at').notNull(),
  ...drizzleTimestamps,
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
