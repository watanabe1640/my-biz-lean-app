// src/app/api/auth/register/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// src/app/api/auth/register/route.ts
export async function POST(request: Request) {
	try {
	  const { name, email, password } = await request.json();
	  
	  const client = createClient();
	  await client.connect();
  
	  // メールアドレスの重複チェック
	  const existingUser = await client.query(
		'SELECT id FROM users WHERE email = $1',
		[email]
	  );
  
	  if (existingUser.rows.length > 0) {
		await client.end();
		return NextResponse.json(
		  { error: 'Email already registered' },
		  { status: 400 }
		);
	  }
  
	  const hashedPassword = await bcrypt.hash(password, 10);
	  const result = await client.query(
		'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
		[name, email, hashedPassword]
	  );
  
	  await client.end();
	  return NextResponse.json({ userId: result.rows[0].id }, { status: 201 });
	} catch (err: unknown) {
	  console.error('Registration error:', err);
	  return NextResponse.json(
		{ error: 'Failed to register user' },
		{ status: 500 }
	  );
	}
  }