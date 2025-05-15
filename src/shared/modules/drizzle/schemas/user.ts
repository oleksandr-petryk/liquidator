import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { GenderEnum, Status, StatusEnum } from './enums';
import { passwordResetRequest } from './passwordResetRequest';
import { picture } from './picture';
import { teamToUser } from './teamToUser';

export const user = pgTable('user', {
  ...drizzlePrimaryKey,
  status: StatusEnum().default(Status.Published),
  email: t.varchar({ length: 320 }).notNull().unique(),
  phoneNumber: t.varchar('phone_number', { length: 15 }).notNull().unique(),
  username: t.varchar({ length: 15 }).notNull().unique(),
  firstName: t.varchar('first_name', { length: 35 }).notNull(),
  lastName: t.varchar('last_name', { length: 35 }).notNull(),
  dateOfBirth: t.timestamp('date_of_birth').notNull(),
  gender: GenderEnum(),
  pictureId: t.integer('picture_id'),
  password: t.varchar({ length: 128 }).notNull(),
  recoveryEmailAddress: t
    .varchar('recovery_email_address', { length: 320 })
    .notNull(),
  ...drizzleTimestamps,
});

export const userToPicture = relations(user, ({ one }) => ({
  picture: one(picture, {
    fields: [user.pictureId],
    references: [picture.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  passwordResetRequest: many(passwordResetRequest),
  teamToUser: many(teamToUser),
}));
