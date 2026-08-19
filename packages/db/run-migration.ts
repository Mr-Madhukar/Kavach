import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = postgres(connectionString, { ssl: 'require', prepare: false });

async function run() {
  try {
    const migrationPath = path.join(__dirname, 'drizzle', '0001_previous_microbe.sql');
    const queries = fs.readFileSync(migrationPath, 'utf8');
    
    // Split queries by semicolon to execute them sequentially if needed, 
    // or just run as one block.
    await sql.unsafe(queries);
    console.log('Migration executed successfully!');
  } catch (err) {
    console.error('Error running migration', err);
  } finally {
    await sql.end();
  }
}

run();
