// src/app/quiz/session/[sessionId]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Quiz {
 id: number;
 question: string;
 options: string[];
 correct_answer: number;
 explanation: string;
}

interface SessionQuiz {
 id: number;
 quiz: Quiz;
 answered: boolean;
 is_correct: boolean | null;
}

export default function QuizSessionPage() {
 const router = useRouter();
 const [currentQuiz, setCurrentQuiz] = useState<SessionQuiz | null>(null);
 const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
 const [showResult, setShowResult] = useState(false);

 useEffect(() => {
   fetchNextQuiz();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 const fetchNextQuiz = async () => {
   const sessionId = window.location.pathname.split('/').pop();
   const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
   if (!token) {
     router.push('/auth/login');
     return;
   }

   try {
     const response = await fetch(`/api/quiz-sessions/${sessionId}/next`, {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     });
     
     if (!response.ok) {
       throw new Error('Failed to fetch quiz');
     }

     const data = await response.json();
     if (data.completed) {
       router.push(`/quiz/session/${sessionId}/result`);
       return;
     }
     
     setCurrentQuiz(data);
     setSelectedAnswer(null);
     setShowResult(false);
   } catch (err) {
     console.error('Error:', err);
   }
 };

 const handleAnswer = async () => {
   if (!currentQuiz || selectedAnswer === null) return;
   const sessionId = window.location.pathname.split('/').pop();
   const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
   if (!token) return;

   try {
     const response = await fetch(`/api/quiz-sessions/${sessionId}/answer`, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         quizId: currentQuiz.id,
         answer: selectedAnswer
       })
     });

     if (!response.ok) {
       throw new Error('Failed to submit answer');
     }

     const result = await response.json();
     setShowResult(true);
     setCurrentQuiz(prev => prev ? {
       ...prev,
       answered: true,
       is_correct: result.correct
     } : null);
   } catch (err) {
     console.error('Error:', err);
   }
 };

 if (!currentQuiz) {
   return <div className="p-4">Loading...</div>;
 }

 return (
   <div className="max-w-4xl mx-auto p-4">
     <div className="bg-white rounded-lg shadow-lg p-6">
       <h2 className="text-xl font-bold mb-4">{currentQuiz.quiz.question}</h2>
       <div className="space-y-4">
         {currentQuiz.quiz.options.map((option, index) => (
           <div key={index} className="flex items-center">
             <input
               type="radio"
               id={`option-${index}`}
               name="quiz-answer"
               value={index}
               checked={selectedAnswer === index}
               onChange={() => setSelectedAnswer(index)}
               disabled={showResult}
               className="mr-2"
             />
             <label htmlFor={`option-${index}`}>{option}</label>
           </div>
         ))}
       </div>
       
       {!showResult && selectedAnswer !== null && (
         <button
           onClick={handleAnswer}
           className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
         >
           回答する
         </button>
       )}

       {showResult && (
         <div className={`mt-6 p-4 rounded ${currentQuiz.is_correct ? 'bg-green-100' : 'bg-red-100'}`}>
           <p className="font-bold">{currentQuiz.is_correct ? '正解！' : '不正解'}</p>
           <p className="mt-2">{currentQuiz.quiz.explanation}</p>
           <button
             onClick={fetchNextQuiz}
             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
           >
             次の問題へ
           </button>
         </div>
       )}
     </div>
   </div>
 );
}