import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { Status } from 'src/shared/enums/db.enum';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { StatusEnum } from './enums';
import { picture } from './picture';

export const organization = pgTable('organization', {
  ...drizzlePrimaryKey,
  status: StatusEnum().default(Status.Published),
  name: t.varchar({ length: 30 }).notNull().unique(),
  slug: t.varchar({ length: 30 }).notNull().unique(),
  pictureId: t.uuid('picture_id'),
  ...drizzleTimestamps,
});

export const organizationToPicture = relations(organization, ({ one }) => ({
  picture: one(picture, {
    fields: [organization.pictureId],
    references: [picture.id],
  }),
}));
