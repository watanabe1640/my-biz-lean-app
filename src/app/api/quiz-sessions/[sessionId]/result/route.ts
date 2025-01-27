// src/app/api/quiz-sessions/[sessionId]/result/route.ts
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(
 request: Request,
 context: { params: { sessionId: string } }
) {
 const { sessionId } = await context.params;
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
       COUNT(*) as total_questions,
       COUNT(*) FILTER (WHERE is_correct = true) as correct_answers,
       q.chapter_id
     FROM session_quizzes sq
     JOIN quizzes q ON q.id = sq.quiz_id
     WHERE sq.session_id = $1
     GROUP BY q.chapter_id
   `, [sessionId]);

   return NextResponse.json(result.rows[0]);
 } catch (err) {
   console.error('Error fetching results:', err);
   return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
 } finally {
   await client.end();
 }
}