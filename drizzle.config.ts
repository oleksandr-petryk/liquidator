import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/shared/drizzle/schema',
  dbCredentials: {
    url: process.env.POSTGRES_DB_URI!,
  },
} satisfies Config;
