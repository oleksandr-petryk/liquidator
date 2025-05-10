import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { timestamps } from './timestamps';
import { status, statusEnum } from './enums';
import { picture } from './picture';
import { teamToUser } from './teamToUser';

export const team = pgTable('team', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  status: statusEnum().default(status.Published),
  name: t.varchar({ length: 30 }).notNull(),
  pictureId: t.integer('picture-id'),
  isDefault: t.boolean('is-default').default(false).notNull(),
  ...timestamps,
});

export const teamToPicture = relations(team, ({ one }) => ({
  picture: one(picture, {
    fields: [team.pictureId],
    references: [picture.id],
  }),
}));

export const teamRelations = relations(team, ({ many }) => ({
  teamToUser: many(teamToUser),
}));
