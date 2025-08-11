import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { user } from './user';

export const passwordResetRequest = pgTable('password_reset_request', {
  ...drizzlePrimaryKey,
  userId: uuid('user_id')
    .references(() => user.id)
    .notNull(),
  code: varchar({ length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ...drizzleTimestamps,
});

export const passwordResetRequestRelations = relations(
  passwordResetRequest,
  ({ one }) => ({
    user: one(user, {
      fields: [passwordResetRequest.userId],
      references: [user.id],
    }),
  }),
);
