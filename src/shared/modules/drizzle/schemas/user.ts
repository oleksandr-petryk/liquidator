import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { Status } from 'src/shared/enums/db.enum';

import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { GenderEnum, StatusEnum } from './enums';
import { passwordResetRequest } from './password-reset-request';
import { picture } from './picture';
import { session } from './session';
import { teamToUser } from './team-to-user';

export const user = pgTable('user', {
  ...drizzlePrimaryKey,
  status: StatusEnum().default(Status.Published).notNull(),
  email: t.varchar({ length: 320 }).notNull().unique(),
  phoneNumber: t.varchar('phone_number', { length: 15 }).unique(),
  username: t.varchar({ length: 15 }).notNull().unique(),
  firstName: t.varchar('first_name', { length: 35 }),
  lastName: t.varchar('last_name', { length: 35 }),
  dateOfBirth: t.timestamp('date_of_birth'),
  gender: GenderEnum(),
  pictureId: t.uuid('picture_id'),
  password: t.varchar({ length: 128 }).notNull(),
  recoveryEmailAddress: t.varchar('recovery_email_address', { length: 320 }),
  ...drizzleTimestamps,
});

export const userRelations = relations(user, ({ one, many }) => ({
  picture: one(picture, {
    fields: [user.pictureId],
    references: [picture.id],
  }),
  passwordResetRequest: many(passwordResetRequest),
  teamToUser: many(teamToUser),
  sessions: many(session),
}));
