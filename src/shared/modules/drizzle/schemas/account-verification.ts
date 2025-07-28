import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { user } from './user';

export const accountVerification = pgTable('account_verification', {
  ...drizzlePrimaryKey,
  userId: uuid('user_id')
    .references(() => user.id)
    .notNull(),
  code: varchar({ length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ...drizzleTimestamps,
});

export const accountVerificationRelations = relations(
  accountVerification,
  ({ one }) => ({
    user: one(user, {
      fields: [accountVerification.userId],
      references: [user.id],
    }),
  }),
);
