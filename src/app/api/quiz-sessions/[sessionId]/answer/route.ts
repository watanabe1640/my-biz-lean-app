import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
    const url = new URL(request.url);
    const sessionId = url.pathname.split('/').slice(-2, -1)[0]; //Extract sessionId

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

    const { quizId, answer } = await request.json();

    const client = createClient({
        connectionString: process.env.POSTGRES_URL_NON_POOLING
    });

    try {
        await client.connect();

        // セッションIDを使用して正しいクイズを検証
        const sessionQuizResult = await client.query(
            'SELECT quiz_id FROM session_quizzes WHERE id = $1 AND session_id = $2',
            [quizId, sessionId]
        );

        if (sessionQuizResult.rows.length === 0) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        const actualQuizId = sessionQuizResult.rows[0].quiz_id;

        // 正解を取得
        const quizResult = await client.query(
            'SELECT correct_answer FROM quizzes WHERE id = $1',
            [actualQuizId]
        );

        if (quizResult.rows.length === 0) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        const isCorrect = answer === quizResult.rows[0].correct_answer;

        // 回答を記録
        await client.query(
            'UPDATE session_quizzes SET answered = true, is_correct = $1 WHERE id = $2',
            [isCorrect, quizId]
        );

        // ユーザーの進捗も更新
        await client.query(
            'INSERT INTO user_progress (user_id, quiz_id, is_correct) VALUES ($1, $2, $3) ON CONFLICT (user_id, quiz_id) DO UPDATE SET is_correct = $3',
            [decoded.userId, actualQuizId, isCorrect]
        );

        return NextResponse.json({ correct: isCorrect });
    } catch (err) {
        console.error('Error recording answer:', err);
        return NextResponse.json({ error: 'Failed to record answer' }, { status: 500 });
    } finally {
        await client.end();
    }
}