import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { primaryKey } from './primaryKey';
import { timestamps } from './timestamps';
import { user } from './user';

export const passwordResetRequest = pgTable('password_reset_request', {
  ...primaryKey,
  userId: t.uuid('user_id').notNull(),
  code: t.varchar({ length: 6 }).notNull(),
  expiresIn: t.timestamp('updated_at').notNull(),
  ...timestamps,
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
