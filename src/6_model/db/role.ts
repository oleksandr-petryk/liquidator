import { relations } from 'drizzle-orm';
import { jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { organization } from './organization';

export const role = pgTable('role', {
  ...drizzlePrimaryKey,
  organizationId: uuid('organization_id')
    .references(() => organization.id)
    .notNull(),
  name: varchar({ length: 30 }).notNull(),
  permissions: jsonb().$type<{ action: string }>().notNull(),
});

export const roleRelations = relations(role, ({ one }) => ({
  organization: one(organization, {
    fields: [role.organizationId],
    references: [organization.id],
  }),
}));
