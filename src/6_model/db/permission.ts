import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { organization } from './organization';

export const permission = pgTable('permission', {
  ...drizzlePrimaryKey,
  action: varchar().notNull(),
  organizationId: uuid('organization_id')
    .references(() => organization.id)
    .notNull(),
  ...drizzleTimestamps,
});

export const permissionRelations = relations(permission, ({ one }) => ({
  organization: one(organization, {
    fields: [permission.organizationId],
    references: [organization.id],
  }),
}));
