// src/app/api/progress/summary/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
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
    
    const result = await client.query(`
      WITH chapter_stats AS (
        SELECT 
          c.id as chapter_id,
          c.title as chapter_title,
          COUNT(q.id) as total_questions,
          COUNT(up.id) FILTER (WHERE up.is_correct = true AND up.user_id = $1) as correct_answers
        FROM chapters c
        LEFT JOIN quizzes q ON q.chapter_id = c.id
        LEFT JOIN user_progress up ON up.quiz_id = q.id AND up.user_id = $1
        GROUP BY c.id, c.title
      )
      SELECT 
        chapter_id,
        chapter_title,
        total_questions,
        correct_answers,
        CASE 
          WHEN total_questions > 0 
          THEN ROUND((correct_answers::float / total_questions) * 100)
          ELSE 0
        END as progress_percentage
      FROM chapter_stats
      ORDER BY chapter_id
    `, [decoded.userId]);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching progress:', err);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  } finally {
    await client.end();
  }
}