// src/app/api/progress/route.ts
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

const { quizId, isCorrect } = await request.json();

const client = createClient({
  connectionString: process.env.POSTGRES_URL_NON_POOLING
});

try {
  await client.connect();
  
  // 既存のエントリーを削除（UPSERTの代わり）
  await client.query(
    'DELETE FROM user_progress WHERE user_id = $1 AND quiz_id = $2',
    [decoded.userId, quizId]
  );
  
  // 新しいエントリーを挿入
  await client.query(
    'INSERT INTO user_progress (user_id, quiz_id, is_correct) VALUES ($1, $2, $3)',
    [decoded.userId, quizId, isCorrect]
  );
  
  return NextResponse.json({ success: true });
} catch (err) {
  console.error('Error saving progress:', err);
  return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
} finally {
  await client.end();
}
}