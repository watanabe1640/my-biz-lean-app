// src/app/api/auth/login/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
 try {
   const { email, password } = await request.json();
   const client = createClient();
   await client.connect();

   const result = await client.query(
     'SELECT id, email, password FROM users WHERE email = $1',
     [email]
   );

   if (result.rows.length === 0) {
     await client.end();
     return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
   }

   const validPassword = await bcrypt.compare(password, result.rows[0].password);
   await client.end();

   if (!validPassword) {
     return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
   }

   const token = createToken({
     userId: result.rows[0].id,
     email: result.rows[0].email
   });

   const response = NextResponse.json({ success: true }, { status: 200 });
   response.cookies.set('auth-token', token, {
     httpOnly: false,
     secure: process.env.NODE_ENV === 'production',
     sameSite: 'strict',
     maxAge: 86400
   });

   return response;
 } catch (err: unknown) {
   console.error('Login error:', err);
   return NextResponse.json({ error: 'Login failed' }, { status: 500 });
 }
}