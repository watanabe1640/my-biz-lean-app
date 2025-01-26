// src/app/quiz/page.tsx
'use client';
import { useEffect, useState } from 'react';

interface Quiz {
 id: number;
 book_id: number;
 question: string;
 options: string[];
 correct_answer: number;
 explanation: string;
}

export default function QuizPage() {
 const [quizzes, setQuizzes] = useState<Quiz[]>([]);

 useEffect(() => {
   async function fetchQuizzes() {
     try {
       const response = await fetch('/api/quiz');
       const data = await response.json();
       setQuizzes(data);
     } catch (error) {
       console.error('Failed to fetch quizzes:', error);
     }
   }
   fetchQuizzes();
 }, []);

 return (
   <div className="max-w-4xl mx-auto p-4">
     <h1 className="text-2xl font-bold mb-4">クイズ一覧</h1>
     {quizzes.map((quiz) => (
       <div key={quiz.id} className="border p-4 rounded-lg mb-4">
         <h2 className="font-bold">{quiz.question}</h2>
         <div className="mt-2 space-y-2">
           {quiz.options.map((option, index) => (
             <div key={index} className="ml-4">{option}</div>
           ))}
         </div>
       </div>
     ))}
   </div>
 );
}