// src/app/quiz/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
  id: number;
  title: string;
  author: string;
  total_quizzes: number;
  completed_quizzes: number;
}

export default function QuizPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function fetchBooks() {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch('/api/books', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    }

    fetchBooks();
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">学習教材</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="border rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="aspect-[3/4] relative bg-gray-100 rounded-t-lg flex items-center justify-center p-4">
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <span>進捗</span>
                <span>{Math.round((book.completed_quizzes / book.total_quizzes) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(book.completed_quizzes / book.total_quizzes) * 100}%` }}
                ></div>
              </div>
              <button 
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                onClick={() => router.push(`/quiz/${book.id}`)}
              >
                学習を始める
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}