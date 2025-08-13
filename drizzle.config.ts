import 'dotenv/config';

import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/6_model/db/index.ts',
  dbCredentials: {
    url: process.env.POSTGRES_DB_URI!,
  },
} satisfies Config;
