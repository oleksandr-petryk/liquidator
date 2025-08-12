import { uuid } from 'drizzle-orm/pg-core';

export const drizzlePrimaryKey = {
  id: uuid().defaultRandom().primaryKey(),
};
