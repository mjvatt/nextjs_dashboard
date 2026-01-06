
// scripts/peek-password.js
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

(async () => {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`SELECT email, password FROM users WHERE email = 'user@nextmail.com'`;
  console.log(rows[0]); // should show { email: 'user@nextmail.com', password: '...' }
})().catch(console.error);
