import { pgEnum } from 'drizzle-orm/pg-core';

import { Gender, Role, Status } from '../../../enums/db.enum';

export const StatusEnum = pgEnum('status', [
  Status.Published,
  Status.Draft,
  Status.Archived,
]);

export const GenderEnum = pgEnum('genres', [Gender.Male, Gender.Female]);

export const RoleEnum = pgEnum('roles', [Role.Member, Role.Admin, Role.Owner]);
