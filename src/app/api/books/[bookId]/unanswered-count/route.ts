// src/app/api/books/[bookId]/unanswered-count/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  const bookId = params.bookId;
  
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
      SELECT COUNT(DISTINCT q.id) as count
      FROM quizzes q
      JOIN chapters c ON c.id = q.chapter_id
      LEFT JOIN user_progress up ON up.quiz_id = q.id AND up.user_id = $1
      WHERE c.book_id = $2 AND up.id IS NULL
    `, [decoded.userId, bookId]);

    return NextResponse.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Error counting unanswered quizzes:', err);
    return NextResponse.json({ error: 'Failed to count unanswered quizzes' }, { status: 500 });
  } finally {
    await client.end();
  }
}