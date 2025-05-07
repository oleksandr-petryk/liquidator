import { pgEnum } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['published', 'draft', 'archived']);

export const genderEnum = pgEnum('genres', ['male', 'female']);

export const roleEnum = pgEnum('roles', ['member', 'admin', 'owner']);
