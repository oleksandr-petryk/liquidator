import { relations } from 'drizzle-orm';
import { jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { clientFingerprint } from './client-fingerprint';
import { drizzlePrimaryKey } from './consts/primaryKey';
import { ActivityLogActionEnum } from './enums';
import { user } from './user';

export const activityLog = pgTable('activity_log', {
  ...drizzlePrimaryKey,
  userId: uuid('user_id')
    .references(() => user.id)
    .notNull(),
  actions: ActivityLogActionEnum().notNull(),
  secretContext: jsonb().notNull(),
  context: jsonb().notNull(),
  clientFingerprintId: uuid('client-fingerprint-id').references(
    () => clientFingerprint.id,
  ),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(user, {
    fields: [activityLog.userId],
    references: [user.id],
  }),
  clientFingerprint: one(clientFingerprint, {
    fields: [activityLog.clientFingerprintId],
    references: [clientFingerprint.id],
  }),
}));
