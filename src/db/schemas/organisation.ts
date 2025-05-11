import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { Status, StatusEnum } from './enums';
import { relations } from 'drizzle-orm';
import { picture } from './picture';
import { timestamps } from './timestamps';
import { id } from './id';

export const organization = pgTable('organization', {
  ...id,
  status: StatusEnum().default(Status.Published),
  name: t.varchar({ length: 30 }).notNull().unique(),
  slug: t.varchar({ length: 30 }).notNull().unique(),
  pictureId: t.integer('picture_id'),
  ...timestamps,
});

export const organizationToPicture = relations(organization, ({ one }) => ({
  picture: one(picture, {
    fields: [organization.pictureId],
    references: [picture.id],
  }),
}));
