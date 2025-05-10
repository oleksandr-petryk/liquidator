import { pgEnum } from 'drizzle-orm/pg-core';

export enum status {
  Published = 'published',
  Draft = 'draft',
  Archived = 'archived',
}

export enum gender {
  Male = 'male',
  Female = 'female',
}

export enum role {
  Member = 'member',
  Admin = 'admin',
  Owner = 'owner',
}

export const statusEnum = pgEnum('status', [
  status.Published,
  status.Draft,
  status.Archived,
]);

export const genderEnum = pgEnum('genres', [gender.Male, gender.Female]);

export const roleEnum = pgEnum('roles', [role.Member, role.Admin, role.Owner]);
