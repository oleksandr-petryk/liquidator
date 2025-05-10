import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { timestamps } from './timestamps';
import { genderEnum, status, statusEnum } from './enums';
import { passwordResetRequest } from './passwordResetRequest';
import { picture } from './picture';
import { teamToUser } from './teamToUser';

export const user = pgTable('pictures', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  status: statusEnum().default(status.Published),
  email: t.varchar({ length: 320 }).notNull().unique(),
  phoneNumber: t.varchar('phone-number', { length: 15 }).notNull().unique(),
  username: t.varchar({ length: 15 }).notNull().unique(),
  firstName: t.varchar('first-name', { length: 35 }).notNull(),
  lastName: t.varchar('last-name', { length: 35 }).notNull(),
  dateOfBirth: t.timestamp('date-of-birth').notNull(),
  gender: genderEnum(),
  pictureId: t.integer('picture-id'),
  password: t.varchar({ length: 128 }).notNull(),
  recoveryEmailAddress: t
    .varchar('recovery-email-address', { length: 320 })
    .notNull(),
  ...timestamps,
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
