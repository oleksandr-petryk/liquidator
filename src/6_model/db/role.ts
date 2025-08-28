import { relations } from 'drizzle-orm';
import { pgTable, unique, uuid, varchar } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { organization } from './organization';

export const role = pgTable(
  'role',
  {
    ...drizzlePrimaryKey,
    organizationId: uuid('organization_id')
      .references(() => organization.id)
      .notNull(),
    name: varchar({ length: 30 }).notNull(),
  },
  (t) => [unique('unique_role_organization').on(t.name, t.organizationId)],
);

export const roleRelations = relations(role, ({ one }) => ({
  organization: one(organization, {
    fields: [role.organizationId],
    references: [organization.id],
  }),
}));
