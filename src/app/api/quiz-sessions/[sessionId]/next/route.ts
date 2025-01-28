import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.pathname.split('/').slice(-2, -1)[0]; // Extract sessionId

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID not found' }, { status: 400 });
  }

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
      SELECT sq.id as session_quiz_id, q.* 
      FROM session_quizzes sq
      JOIN quizzes q ON q.id = sq.quiz_id
      WHERE sq.session_id = $1 
      AND sq.answered = false
      ORDER BY sq.order_number
      LIMIT 1
    `, [sessionId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ completed: true });
    }

    return NextResponse.json({
      id: result.rows[0].session_quiz_id,
      quiz: {
        id: result.rows[0].id,
        question: result.rows[0].question,
        options: result.rows[0].options,
        correct_answer: result.rows[0].correct_answer,
        explanation: result.rows[0].explanation
      },
      answered: false,
      is_correct: null
    });
  } catch (err) {
    console.error('Error fetching next quiz:', err);
    return NextResponse.json({ error: 'Failed to fetch next quiz' }, { status: 500 });
  } finally {
    await client.end();
  }
}