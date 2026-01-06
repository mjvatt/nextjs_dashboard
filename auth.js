
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs'; // recommend bcryptjs on Windows

async function getUser(email) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const rows = await sql`
      SELECT id, name, email, password
      FROM users
      WHERE lower(email) = lower(${email.trim()})
      LIMIT 1
    `;
    return rows[0] ?? null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) {
          console.log('Invalid credentials shape');
          return null;
        }

        const { email, password } = parsed.data;

        const user = await getUser(email);
        if (!user) {
          console.log('User not found');
          return null;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
          console.log('Invalid credentials');
          return null;
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});
