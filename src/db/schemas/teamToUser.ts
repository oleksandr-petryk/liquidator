import { relations } from 'drizzle-orm';
import { pgTable, primaryKey } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { roleEnum } from './enums';
import { team } from './team';
import { user } from './user';

export const teamToUser = pgTable(
  'team-to-user',
  {
    userId: t.integer('user-id').notNull(),
    teamId: t.integer('team-id').notNull(),
    role: roleEnum().default('member'),
    isFavorite: t.boolean('is-favorite').default(false).notNull(),
    isDefault: t.boolean('is-default').default(false).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.teamId] })],
);

export const teamToUserRelations = relations(teamToUser, ({ one }) => ({
  team: one(team, {
    fields: [teamToUser.teamId],
    references: [team.id],
  }),

  user: one(user, {
    fields: [teamToUser.userId],
    references: [user.id],
  }),
}));
