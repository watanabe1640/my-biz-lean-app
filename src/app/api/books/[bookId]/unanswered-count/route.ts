// src/app/api/books/[bookId]/unanswered-count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';
import { verifyToken } from '@/lib/auth/jwt';

// src/app/api/books/[bookId]/unanswered-count/route.ts
export async function GET(
	request: NextRequest,
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
	  
	  const result = await client.query(`
		SELECT COUNT(DISTINCT q.id) as count
		FROM quizzes q
		JOIN chapters c ON c.id = q.chapter_id
		LEFT JOIN user_progress up ON up.quiz_id = q.id AND up.user_id = $1
		WHERE c.book_id = $2 AND up.id IS NULL
	  `, [decoded.userId, bookId]);  // ここを修正
  
	  return NextResponse.json({ count: parseInt(result.rows[0].count) });
	} catch (err) {
	  console.error('Error counting unanswered quizzes:', err);
	  return NextResponse.json({ error: 'Failed to count unanswered quizzes' }, { status: 500 });
	} finally {
	  await client.end();
	}
  }