import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { USER_PROPERTIES } from '../../5_shared/config/const/user.const';
import { Status } from '../../5_shared/enums/db.enum';
import { accountVerification } from './account-verification';
import { drizzlePrimaryKey } from './consts/primaryKey';
import { drizzleTimestamps } from './consts/timestamps';
import { GenderEnum, StatusEnum } from './enums';
import { passwordResetRequest } from './password-reset-request';
import { picture } from './picture';
import { teamToUser } from './team-to-user';

export const user = pgTable('user', {
  ...drizzlePrimaryKey,
  status: StatusEnum().default(Status.Published).notNull(),
  verified: boolean().default(false).notNull(),
  email: varchar({ length: USER_PROPERTIES.email.maxLength })
    .notNull()
    .unique(),
  phoneNumber: varchar('phone_number', {
    length: USER_PROPERTIES.phoneNumber.maxLength,
  }).unique(),
  username: varchar({ length: USER_PROPERTIES.username.maxLength })
    .notNull()
    .unique(),
  firstName: varchar('first_name', {
    length: USER_PROPERTIES.firstName.maxLength,
  }),
  lastName: varchar('last_name', {
    length: USER_PROPERTIES.lastName.maxLength,
  }),
  dateOfBirth: timestamp('date_of_birth'),
  gender: GenderEnum(),
  pictureId: uuid('picture_id')
    .unique()
    .references(() => picture.id),
  password: varchar({ length: USER_PROPERTIES.password.maxLength }).notNull(),
  recoveryEmailAddress: varchar('recovery_email_address', {
    length: USER_PROPERTIES.email.maxLength,
  }),
  ...drizzleTimestamps,
});

export const userRelations = relations(user, ({ one, many }) => ({
  picture: one(picture, {
    fields: [user.pictureId],
    references: [picture.id],
  }),
  passwordResetRequest: many(passwordResetRequest),
  accountVerification: many(accountVerification),
  teamToUser: many(teamToUser),
}));
