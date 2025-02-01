// src/app/api/difficulties/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM difficulty_levels ORDER BY id');
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching difficulties:', err);
    return NextResponse.json({ error: 'Failed to fetch difficulties' }, { status: 500 });
  } finally {
    await client.end();
  }
}