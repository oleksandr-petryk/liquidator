import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { Status } from 'src/shared/enums/db.enum';

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
  verifyed: boolean().default(false).notNull(),
  email: varchar({ length: 320 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 15 }).unique(),
  username: varchar({ length: 15 }).notNull().unique(),
  firstName: varchar('first_name', { length: 35 }),
  lastName: varchar('last_name', { length: 35 }),
  dateOfBirth: timestamp('date_of_birth'),
  gender: GenderEnum(),
  pictureId: uuid('picture_id')
    .unique()
    .references(() => picture.id),
  password: varchar({ length: 128 }).notNull(),
  recoveryEmailAddress: varchar('recovery_email_address', { length: 320 }),
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
