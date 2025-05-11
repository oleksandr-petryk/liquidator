import { pgEnum } from 'drizzle-orm/pg-core';

export enum Status {
  Published = 'published',
  Draft = 'draft',
  Archived = 'archived',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum Role {
  Member = 'member',
  Admin = 'admin',
  Owner = 'owner',
}

export const StatusEnum = pgEnum('status', [
  Status.Published,
  Status.Draft,
  Status.Archived,
]);

export const GenderEnum = pgEnum('genres', [Gender.Male, Gender.Female]);

export const RoleEnum = pgEnum('roles', [Role.Member, Role.Admin, Role.Owner]);
