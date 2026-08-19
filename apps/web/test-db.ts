import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '../../.env') });
const sql = postgres(process.env.DATABASE_URL!);

async function run() {
  try {
    console.log("Creating user...");
    const profile_sub = '123456';
    const email = 'test2@test.com';
    
    // First insert
    await sql`
      INSERT INTO users (id, google_sub, email, name, avatar_url)
      VALUES (${profile_sub}, ${profile_sub}, ${email}, 'Test User', 'url')
      ON CONFLICT (google_sub) DO UPDATE SET name = 'Test User Updated';
    `;
    console.log("First insert success");
    
    // Second insert
    await sql`
      INSERT INTO users (id, google_sub, email, name, avatar_url)
      VALUES (${profile_sub}, ${profile_sub}, ${email}, 'Test User 2', 'url')
      ON CONFLICT (google_sub) DO UPDATE SET name = 'Test User Updated 2';
    `;
    console.log("Second insert success");
    
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sql.end();
  }
}

run();
