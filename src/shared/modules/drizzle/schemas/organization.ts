import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { Status, StatusEnum } from './enums';
import { picture } from './picture';
import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';

export const organization = pgTable('organization', {
  ...drizzlePrimaryKey,
  status: StatusEnum().default(Status.Published),
  name: t.varchar({ length: 30 }).notNull().unique(),
  slug: t.varchar({ length: 30 }).notNull().unique(),
  pictureId: t.integer('picture_id'),
  ...drizzleTimestamps,
});

export const organizationToPicture = relations(organization, ({ one }) => ({
  picture: one(picture, {
    fields: [organization.pictureId],
    references: [picture.id],
  }),
}));
