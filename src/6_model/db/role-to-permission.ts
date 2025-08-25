import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { drizzleTimestamps } from './consts/timestamps';
import { permission } from './permission';
import { role } from './role';

export const roleToPermission = pgTable(
  'role_to_permission',
  {
    roleId: uuid('role_id')
      .references(() => role.id)
      .notNull(),
    permissionId: uuid('permission_id')
      .references(() => permission.id)
      .notNull(),
    ...drizzleTimestamps,
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionId] })],
);

export const roleToPermissionRelations = relations(
  roleToPermission,
  ({ one }) => ({
    role: one(role, {
      fields: [roleToPermission.roleId],
      references: [role.id],
    }),
    permission: one(permission, {
      fields: [roleToPermission.permissionId],
      references: [permission.id],
    }),
  }),
);
