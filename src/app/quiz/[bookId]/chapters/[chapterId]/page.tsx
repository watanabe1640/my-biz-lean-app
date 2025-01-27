// src/app/quiz/[bookId]/chapters/[chapterId]/page.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function ChapterPage() {
  const router = useRouter();

  const startQuizSession = async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // URLからIDを取得
      const pathParts = window.location.pathname.split('/');
      const chapterId = pathParts[pathParts.length - 1];

      const response = await fetch('/api/quiz-sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionType: 'chapter',
          chapterId
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={startQuizSession}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        クイズを開始する
      </button>
    </div>
  );
}