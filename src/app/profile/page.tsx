// src/app/profile/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Progress {
  book_id: number;
  book_title: string;
  total_quizzes: number;
  completed_quizzes: number;
}

interface User {
  name: string;
  email: string;
  avatar_type: number;
}

interface ProfileData {
  user: User;
  progress: Progress[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error:', err);
      }
    }

    fetchProfile();
  }, [router]);

  if (!profileData) {
    return <div className="p-4">Loading...</div>;
  }

  const totalProgress = profileData.progress.reduce((acc, curr) => {
    return acc + (curr.completed_quizzes / curr.total_quizzes);
  }, 0) / profileData.progress.length * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-900">
      {/* プロフィール情報 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold">{profileData.user.name}</h1>
            <p className="text-gray-900">{profileData.user.email}</p>
          </div>
        </div>
      </div>

      {/* 全体の進捗 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-gray-900">
        <h2 className="text-xl font-bold mb-4">全体の進捗</h2>
        <div className="mb-2 flex justify-between">
          <span>総合進捗率</span>
          <span>{Math.round(totalProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
      </div>

      {/* 書籍ごとの進捗 */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-gray-900">
        <h2 className="text-xl font-bold mb-4">書籍ごとの進捗</h2>
        <div className="space-y-6">
          {profileData.progress.map((book) => (
            <div key={book.book_id}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{book.book_title}</span>
                <span>
                  {book.completed_quizzes} / {book.total_quizzes} 問完了
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ 
                    width: `${(book.completed_quizzes / book.total_quizzes) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}