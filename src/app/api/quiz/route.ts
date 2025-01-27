// src/app/api/quiz/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    const result = await client.query(`
      SELECT 
        q.id,
        q.question,
        q.options,
        q.correct_answer,
        q.explanation,
        c.title as chapter_title,
        d.name as difficulty
      FROM quizzes q
      JOIN chapters c ON q.chapter_id = c.id
      JOIN difficulty_levels d ON q.difficulty_id = d.id
      ORDER BY c.chapter_number, d.id
    `);
    
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  } finally {
    await client.end();
  }
}