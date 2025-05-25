import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { user } from './user';

export const passwordResetRequest = pgTable('password_reset_request', {
  ...drizzlePrimaryKey,
  userId: t.uuid('user_id').notNull(),
  code: t.varchar({ length: 6 }).notNull(),
  expiresIn: t.timestamp('updated_at').notNull(),
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
