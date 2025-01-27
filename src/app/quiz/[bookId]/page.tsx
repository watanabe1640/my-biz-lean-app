'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function BookPage({ }: { params: { bookId: string } }) {
  const router = useRouter();
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);

  useEffect(() => {
    async function fetchBookDetails() {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        // searchParamsを使用せず、コンポーネントの外でURLを構築
        const bookId = window.location.pathname.split('/').pop();
        const response = await fetch(`/api/books/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }

        const data = await response.json();
        setBookDetails(data);
      } catch (err) {
        console.error('Error:', err);
      }
    }

    fetchBookDetails();
  }, [router]);

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
          <h2 className="text-xl font-bold mb-4">学習コンテンツ</h2>
          <div className="space-y-4">
            {bookDetails.chapters.map((chapter) => (
              <div 
                key={chapter.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                onClick={() => {
					const bookId = window.location.pathname.split('/')[2]; // /quiz/[bookId] から取得
      				router.push(`/quiz/${bookId}/chapters/${chapter.id}`);
				}}
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