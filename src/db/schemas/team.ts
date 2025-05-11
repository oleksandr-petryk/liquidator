import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { timestamps } from './timestamps';
import { Status, StatusEnum } from './enums';
import { picture } from './picture';
import { teamToUser } from './teamToUser';
import { id } from './id';

export const team = pgTable('team', {
  ...id,
  status: StatusEnum().default(Status.Published),
  name: t.varchar({ length: 30 }).notNull(),
  pictureId: t.integer('picture_id'),
  isDefault: t.boolean('is_default').default(false).notNull(),
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
