// src/app/api/books/[bookId]/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(
  request: Request,
  context: { params: { bookId: string } }
) {
  const { bookId } = await context.params;
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
    
    const bookResult = await client.query(`
      SELECT 
        b.id,
        b.title,
        b.author,
        b.cover_image_url
      FROM books b
      WHERE b.id = $1
    `, [bookId]);

    if (bookResult.rows.length === 0) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const chaptersResult = await client.query(`
      SELECT 
        c.id,
        c.title as chapter_title,
        c.chapter_number,
        COUNT(q.id) as quiz_count,
        COUNT(up.id) FILTER (WHERE up.user_id = $1 AND up.is_correct = true) as completed_count
      FROM chapters c
      LEFT JOIN quizzes q ON q.chapter_id = c.id
      LEFT JOIN user_progress up ON up.quiz_id = q.id AND up.user_id = $1
      WHERE c.book_id = $2
      GROUP BY c.id, c.title, c.chapter_number
      ORDER BY c.chapter_number
    `, [decoded.userId, bookId]);

    return NextResponse.json({
      book: bookResult.rows[0],
      chapters: chaptersResult.rows
    });
  } catch (err) {
    console.error('Error fetching book details:', err);
    return NextResponse.json({ error: 'Failed to fetch book details' }, { status: 500 });
  } finally {
    await client.end();
  }
}