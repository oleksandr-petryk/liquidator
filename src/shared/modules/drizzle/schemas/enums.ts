import { pgEnum } from 'drizzle-orm/pg-core';

import { Gender, Role, Status } from '../../../enums/db.enum';

export const StatusEnum = pgEnum('publish_status', [
  Status.Published,
  Status.Draft,
  Status.Archived,
]);

export const GenderEnum = pgEnum('user_genders', [Gender.Male, Gender.Female]);

export const RoleEnum = pgEnum('user_roles', [
  Role.Member,
  Role.Admin,
  Role.Owner,
]);
