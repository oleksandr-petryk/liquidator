import * as path from 'node:path';

import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '..', '.env') });

process.env.NODE_ENV = 'test';
