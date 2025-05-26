import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { Status } from 'src/shared/enums/db.enum';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { StatusEnum } from './enums';
import { picture } from './picture';
import { teamToUser } from './team-to-user';

export const team = pgTable('team', {
  ...drizzlePrimaryKey,
  status: StatusEnum().default(Status.Published).notNull(),
  name: t.varchar({ length: 30 }).notNull(),
  pictureId: t.uuid('picture_id'),
  isDefault: t.boolean('is_default').default(false).notNull(),
  ...drizzleTimestamps,
});

export const teamRelations = relations(team, ({ one, many }) => ({
  picture: one(picture, {
    fields: [team.pictureId],
    references: [picture.id],
  }),
  teamToUser: many(teamToUser),
}));
