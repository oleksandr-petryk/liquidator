import { relations } from 'drizzle-orm';
import { boolean, pgTable, unique, uuid } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { organization } from './organization';
import { user } from './user';

export const member = pgTable(
  'member',
  {
    ...drizzlePrimaryKey,
    userId: uuid('user_id')
      .references(() => user.id)
      .notNull(),
    organizationId: uuid('organization_id')
      .references(() => organization.id)
      .notNull(),
    ...drizzleTimestamps,
    isDefault: boolean('is_default').notNull(),
  },
  (t) => [unique('unique_user_organization').on(t.userId, t.organizationId)],
);

export const memberRelations = relations(member, ({ one }) => ({
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
}));
