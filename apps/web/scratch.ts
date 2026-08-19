import { db } from "db";

async function main() {
  try {
    const existing = await db.query.users.findFirst();
    console.log("Existing user:", existing);
  } catch (e) {
    console.error("DB Error:", e);
  }
  process.exit(0);
}
main();
