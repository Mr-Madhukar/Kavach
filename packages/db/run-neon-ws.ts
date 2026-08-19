import { neon, neonConfig } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as path from 'path';
config({ path: path.resolve(process.cwd(), '..', '..', '.env') });
import * as fs from 'fs';
import ws from 'ws';

// Required for Node.js environment
neonConfig.webSocketConstructor = ws;

async function run() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL not found in .env");

    console.log("Connecting via WebSocket to Neon...");
    const sql = neon(url);
    
    console.log("Reading SQL files...");
    const sql1 = fs.readFileSync(path.join(process.cwd(), 'drizzle', '0000_youthful_betty_brant.sql'), 'utf-8');
    const sql2 = fs.readFileSync(path.join(process.cwd(), 'drizzle', '0001_previous_microbe.sql'), 'utf-8');
    
    // Process statements individually
    const statements = [
      ...sql1.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s.length > 0),
      ...sql2.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s.length > 0)
    ];

    console.log(`Found ${statements.length} statements. Executing...`);
    
    for (let i = 0; i < statements.length; i++) {
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      await sql.query(statements[i]);
    }
    
    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
