// src/app/api/quiz-sessions/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

interface PostgresError extends Error {
  code?: string;
  detail?: string;
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { sessionType, bookId, difficultyId } = await request.json();

    const client = createClient({
      connectionString: process.env.POSTGRES_URL_NON_POOLING
    });

    await client.connect();

    // セッション作成
    const sessionResult = await client.query(
      'INSERT INTO quiz_sessions (user_id, session_type) VALUES ($1, $2) RETURNING id',
      [decoded.userId, sessionType]
    );
    const sessionId = sessionResult.rows[0].id;

    // クイズの取得
    let quizzes;
    if (sessionType === 'difficulty') {
      quizzes = await client.query(`
        SELECT q.id 
        FROM quizzes q
        JOIN chapters c ON c.id = q.chapter_id
        WHERE c.book_id = $1 AND q.difficulty_id = $2
        ORDER BY RANDOM()
        LIMIT 10
      `, [bookId, difficultyId]);
    } else {
      quizzes = await client.query(`
        SELECT q.id 
        FROM quizzes q
        JOIN chapters c ON c.id = q.chapter_id
        WHERE c.book_id = $1
        ORDER BY RANDOM()
        LIMIT 10
      `, [bookId]);
    }

    // セッションクイズの作成
    for (let i = 0; i < quizzes.rows.length; i++) {
      await client.query(
        'INSERT INTO session_quizzes (session_id, quiz_id, order_number) VALUES ($1, $2, $3)',
        [sessionId, quizzes.rows[i].id, i + 1]
      );
    }

    await client.end();
    return NextResponse.json({ sessionId });
  } catch (error: unknown) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? (error as PostgresError).code : undefined,
      detail: error instanceof Error && 'detail' in error ? (error as PostgresError).detail : undefined
    });
    return NextResponse.json({ error: 'Failed to create quiz session' }, { status: 500 });
  }
}