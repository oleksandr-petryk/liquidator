import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { drizzleTimestamps } from './consts/timestamps';
import { member } from './member';
import { role } from './role';

export const memberToRole = pgTable(
  'member_to_role',
  {
    memberId: uuid('member_id')
      .references(() => member.id)
      .notNull(),
    roleId: uuid('role_id')
      .references(() => role.id)
      .notNull(),
    createdAt: drizzleTimestamps.createdAt,
  },
  (t) => [primaryKey({ columns: [t.roleId, t.memberId] })],
);

export const memberToRoleRelations = relations(memberToRole, ({ one }) => ({
  member: one(member, {
    fields: [memberToRole.memberId],
    references: [member.id],
  }),
  role: one(role, {
    fields: [memberToRole.roleId],
    references: [role.id],
  }),
}));
