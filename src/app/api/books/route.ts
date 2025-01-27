// src/app/api/books/route.ts
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
      SELECT 
        b.id,
        b.title,
        b.author,
		b.cover_image_url,
        COUNT(q.id) as total_quizzes,
        COUNT(up.id) FILTER (WHERE up.user_id = $1 AND up.is_correct = true) as completed_quizzes
      FROM books b
      LEFT JOIN chapters c ON c.book_id = b.id
      LEFT JOIN quizzes q ON q.chapter_id = c.id
      LEFT JOIN user_progress up ON up.quiz_id = q.id AND up.user_id = $1
      GROUP BY b.id, b.title, b.author, b.cover_image_url
      ORDER BY b.id
    `, [decoded.userId]);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  } finally {
    await client.end();
  }
}