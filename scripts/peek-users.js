// scripts/peek-users.js
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

(async () => {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`SELECT id, name, email FROM users ORDER BY email`;
  console.log(rows);            // <-- rows directly
  console.log('Count:', rows.length);
})().catch(console.error);
