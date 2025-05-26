import { relations } from 'drizzle-orm';
import { pgTable, primaryKey } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { Role } from 'src/shared/enums/db.enum';

import { drizzleTimestamps } from './consts/timestamps';
import { RoleEnum } from './enums';
import { team } from './team';
import { user } from './user';

export const teamToUser = pgTable(
  'team_to_user',
  {
    userId: t.uuid('user_id').notNull(),
    teamId: t.uuid('team_id').notNull(),
    role: RoleEnum().default(Role.Member).notNull(),
    isFavorite: t.boolean('is_favorite').default(false).notNull(),
    isDefault: t.boolean('is_default').default(false).notNull(),
    ...drizzleTimestamps,
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
