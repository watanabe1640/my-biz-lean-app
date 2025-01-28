// src/app/api/quiz-sessions/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { sessionType, chapterId } = await request.json();
  
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();

    // セッション作成
    const sessionResult = await client.query(
      'INSERT INTO quiz_sessions (user_id, session_type, chapter_id) VALUES ($1, $2, $3) RETURNING id',
      [decoded.userId, sessionType, chapterId]
    );
    const sessionId = sessionResult.rows[0].id;

    let quizzes;
    if (sessionType === 'chapter') {
      quizzes = await client.query(
        'SELECT id FROM quizzes WHERE chapter_id = $1 ORDER BY RANDOM()',
        [chapterId]
      );
    } else if (sessionType === 'unanswered') {
      quizzes = await client.query(`
        SELECT q.id 
        FROM quizzes q
        JOIN chapters c ON c.id = q.chapter_id
        LEFT JOIN user_progress up ON up.quiz_id = q.id AND up.user_id = $1
        WHERE c.book_id = $2 AND up.id IS NULL
        ORDER BY RANDOM()
        LIMIT 10
      `, [decoded.userId, chapterId]); // chapterIdの代わりにbookIdを使用
    } else { // random
      quizzes = await client.query(`
        SELECT q.id 
        FROM quizzes q
        JOIN chapters c ON c.id = q.chapter_id
        WHERE c.book_id = $1
        ORDER BY RANDOM()
        LIMIT 10
      `, [chapterId]); // chapterIdの代わりにbookIdを使用
    }

    // セッションクイズの作成
    for (let i = 0; i < quizzes.rows.length; i++) {
      await client.query(
        'INSERT INTO session_quizzes (session_id, quiz_id, order_number) VALUES ($1, $2, $3)',
        [sessionId, quizzes.rows[i].id, i + 1]
      );
    }

    return NextResponse.json({ sessionId });
  } catch (err) {
    console.error('Error creating quiz session:', err);
    return NextResponse.json({ error: 'Failed to create quiz session' }, { status: 500 });
  } finally {
    await client.end();
  }
}