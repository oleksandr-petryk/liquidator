import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { Status } from 'src/shared/enums/db.enum';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { StatusEnum } from './enums';
import { picture } from './picture';

export const organization = pgTable('organization', {
  ...drizzlePrimaryKey,
  status: StatusEnum().default(Status.Published),
  name: varchar({ length: 30 }).notNull().unique(),
  slug: varchar({ length: 30 }).notNull().unique(),
  pictureId: uuid('picture_id').references(() => picture.id),
  ...drizzleTimestamps,
});

export const organizationToPicture = relations(organization, ({ one }) => ({
  picture: one(picture, {
    fields: [organization.pictureId],
    references: [picture.id],
  }),
}));
