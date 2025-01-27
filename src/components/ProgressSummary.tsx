// src/components/ProgressSummary.tsx
'use client';
import { useEffect, useState } from 'react';

interface ChapterProgress {
  chapter_id: number;
  chapter_title: string;
  total_questions: number;
  correct_answers: number;
  progress_percentage: number;
}

export default function ProgressSummary() {
  const [progress, setProgress] = useState<ChapterProgress[]>([]);

  useEffect(() => {
    async function fetchProgress() {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
      
      if (!token) return;

      try {
        const response = await fetch('/api/progress/summary', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setProgress(data);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      }
    }

    fetchProgress();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">学習進捗</h2>
      {progress.map((chapter) => (
        <div key={chapter.chapter_id} className="mb-4">
          <div className="flex justify-between mb-1">
            <span>{chapter.chapter_title}</span>
            <span>{chapter.progress_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${chapter.progress_percentage}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {chapter.correct_answers} / {chapter.total_questions} 問正解
          </div>
        </div>
      ))}
    </div>
  );
}