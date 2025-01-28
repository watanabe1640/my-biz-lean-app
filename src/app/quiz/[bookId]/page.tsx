// src/app/quiz/[bookId]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

interface Chapter {
  id: number;
  chapter_title: string;
  chapter_number: number;
  quiz_count: number;
  completed_count: number;
}

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image_url: string;
}

interface BookDetails {
  book: Book;
  chapters: Chapter[];
}

export default function BookPage() {
  const router = useRouter();
  const params = useParams();
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [hasUnansweredQuizzes, setHasUnansweredQuizzes] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        // 書籍詳細の取得
        const bookResponse = await fetch(`/api/books/${params.bookId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!bookResponse.ok) throw new Error('Failed to fetch book details');
        const bookData = await bookResponse.json();
        setBookDetails(bookData);

        // 未回答クイズの数を確認
        const unansweredResponse = await fetch(`/api/books/${params.bookId}/unanswered-count`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (unansweredResponse.ok) {
          const { count } = await unansweredResponse.json();
          setHasUnansweredQuizzes(count > 0);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }

    fetchData();
  }, [router, params.bookId]);

  const startQuizSession = async (mode: 'random' | 'unanswered') => {
    if (loading) return;
    setLoading(true);

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
          sessionType: mode,
          chapterId: params.bookId
        })
      });

      if (!response.ok) throw new Error('Failed to create session');

      const { sessionId } = await response.json();
      router.push(`/quiz/session/${sessionId}`);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  if (!bookDetails) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 書籍情報 */}
        <div className="md:w-1/3">
          <div className="aspect-[2/3] relative bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={bookDetails.book.cover_image_url}
              alt={bookDetails.book.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain p-4"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold mt-4">{bookDetails.book.title}</h1>
          <p className="text-gray-600">{bookDetails.book.author}</p>
        </div>

        {/* 章一覧 */}
        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">学習コンテンツ</h2>
            <div className="space-x-4">
              <button
                onClick={() => startQuizSession('random')}
                disabled={loading}
                className={`bg-blue-600 text-white px-4 py-2 rounded ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                ランダムモード
              </button>
              {hasUnansweredQuizzes ? (
                <button
                  onClick={() => startQuizSession('unanswered')}
                  disabled={loading}
                  className={`bg-gray-600 text-white px-4 py-2 rounded ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                  }`}
                >
                  未回答モード
                </button>
              ) : (
                <button
                  className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
                  title="全ての問題に取り組み済みです"
                  disabled
                >
                  未回答なし
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {bookDetails.chapters.map((chapter) => (
              <div 
                key={chapter.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                onClick={() => router.push(`/quiz/${params.bookId}/chapters/${chapter.id}`)}
                role="button"
                tabIndex={0}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{chapter.chapter_title}</h3>
                  <span className="text-sm text-gray-600">
                    {chapter.completed_count} / {chapter.quiz_count} 問完了
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(chapter.completed_count / chapter.quiz_count) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}