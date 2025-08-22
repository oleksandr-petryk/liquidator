import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { clientFingerprint } from './client-fingerprint';
import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { user } from './user';

export const session = pgTable('session', {
  ...drizzlePrimaryKey,
  jti: uuid('jti').notNull(),
  refreshTokenHash: varchar('refresh_token_hash', { length: 64 }).notNull(),
  userId: uuid('user_id')
    .references(() => user.id)
    .notNull(),
  clientFingerprintId: uuid('client_fingerprint_id')
    .references(() => clientFingerprint.id)
    .notNull()
    .unique(),
  name: varchar('name', { length: 128 }),
  ...drizzleTimestamps,
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
  clientFingerprint: one(clientFingerprint, {
    fields: [session.clientFingerprintId],
    references: [clientFingerprint.id],
  }),
}));
