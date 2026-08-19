import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema.js';
import * as dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = __dirname.endsWith('dist') 
  ? join(__dirname, '../../../.env')
  : join(__dirname, '../../.env');

dotenv.config({ path: envPath });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export * from './schema.js';
