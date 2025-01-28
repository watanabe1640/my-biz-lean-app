// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
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
    
    const userResult = await client.query(`
      SELECT name, email, avatar_type 
      FROM users 
      WHERE id = $1
    `, [decoded.userId]);

    const progressResult = await client.query(`
      SELECT 
        b.id as book_id,
        b.title as book_title,
        COUNT(DISTINCT q.id) as total_quizzes,
        COUNT(DISTINCT CASE WHEN up.is_correct = true THEN q.id END) as completed_quizzes
      FROM books b
      LEFT JOIN chapters c ON c.book_id = b.id
      LEFT JOIN quizzes q ON q.chapter_id = c.id
      LEFT JOIN user_progress up ON up.quiz_id = q.id AND up.user_id = $1
      GROUP BY b.id, b.title
      ORDER BY b.id
    `, [decoded.userId]);

    return NextResponse.json({
      user: userResult.rows[0],
      progress: progressResult.rows
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  } finally {
    await client.end();
  }
}