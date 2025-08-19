import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { APP_USER_LENGTHS } from '../../5_shared/config/const/app.const';
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
  email: varchar({ length: APP_USER_LENGTHS.email.max }).notNull().unique(),
  phoneNumber: varchar('phone_number', {
    length: APP_USER_LENGTHS.phoneNumber.max,
  }).unique(),
  username: varchar({ length: APP_USER_LENGTHS.username.max })
    .notNull()
    .unique(),
  firstName: varchar('first_name', { length: APP_USER_LENGTHS.name.max }),
  lastName: varchar('last_name', { length: APP_USER_LENGTHS.name.max }),
  dateOfBirth: timestamp('date_of_birth'),
  gender: GenderEnum(),
  pictureId: uuid('picture_id')
    .unique()
    .references(() => picture.id),
  password: varchar({ length: APP_USER_LENGTHS.password.max }).notNull(),
  recoveryEmailAddress: varchar('recovery_email_address', {
    length: APP_USER_LENGTHS.email.max,
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
