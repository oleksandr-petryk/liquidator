import { relations } from 'drizzle-orm';
import { pgTable, unique, uuid } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { organization } from './organization';
import { role } from './role';
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
    roleId: uuid('role_id')
      .references(() => role.id)
      .notNull(),
    ...drizzleTimestamps,
  },
  (t) => ({
    uniqueUserOrganization: unique('unique_user_organization').on(
      t.userId,
      t.organizationId,
    ),
  }),
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
  role: one(role, {
    fields: [member.roleId],
    references: [role.id],
  }),
}));
