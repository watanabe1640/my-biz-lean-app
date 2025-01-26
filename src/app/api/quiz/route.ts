// src/app/api/quiz/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = createClient();
  await client.connect();
  
  const result = await client.query('SELECT * FROM quizzes');
  await client.end();
  
  return NextResponse.json(result.rows);
}