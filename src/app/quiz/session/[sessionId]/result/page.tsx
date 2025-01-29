// src/app/quiz/session/[sessionId]/result/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface QuizResult {
  total_questions: number;
  correct_answers: number;
  chapter_id: number;
}

export default function QuizResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      const sessionId = window.location.pathname.split('/')[3];
      const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch(`/api/quiz-sessions/${sessionId}/result`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchResult();
  }, [router]);

  const startNewSession = async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch('/api/quiz-sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionType: 'chapter',
          chapterId: result?.chapter_id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const { sessionId } = await response.json();
      router.push(`/quiz/session/${sessionId}`);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (!result) {
    return <div className="p-4">Loading...</div>;
  }

  const percentage = Math.round((result.correct_answers / result.total_questions) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">クイズ結果</h1>
        
        <div className="mb-6">
          <div className="text-4xl font-bold text-center text-blue-600 mb-2">
            {percentage}%
          </div>
          <div className="text-center text-gray-600">
            {result.correct_answers} / {result.total_questions} 問正解
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/quiz')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            学習一覧に戻る
          </button>
          <button
            onClick={startNewSession}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            もう一度挑戦
          </button>
        </div>
      </div>
    </div>
  );
}