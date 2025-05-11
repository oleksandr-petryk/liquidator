import { uuid } from 'drizzle-orm/pg-core';

export const primaryKey = {
  id: uuid().defaultRandom(),
};
