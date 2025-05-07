import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { statusEnum } from './enums';
import { relations } from 'drizzle-orm';
import { picture } from './picture';
import { timestamps } from './timestamps';

export const organization = pgTable('organization', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  status: statusEnum().default('published'),
  name: t.varchar({ length: 30 }).notNull().unique(),
  slug: t.varchar({ length: 30 }).notNull().unique(),
  pictureId: t.integer('picture-id'),
  ...timestamps,
});

export const organizationToPicture = relations(organization, ({ one }) => ({
  picture: one(picture, {
    fields: [organization.pictureId],
    references: [picture.id],
  }),
}));
