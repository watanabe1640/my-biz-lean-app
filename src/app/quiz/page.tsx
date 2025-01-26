// src/app/quiz/page.tsx
'use client';
import { useState, useEffect } from 'react';

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
 const [answers, setAnswers] = useState<{[key: number]: number}>({});
 const [results, setResults] = useState<{[key: number]: boolean}>({});

 useEffect(() => {
   async function fetchQuizzes() {
     const response = await fetch('/api/quiz');
     const data = await response.json();
     setQuizzes(data);
   }
   fetchQuizzes();
 }, []);

 const handleAnswer = (quizId: number, selectedAnswer: number) => {
   setAnswers(prev => ({...prev, [quizId]: selectedAnswer}));
 };

 const checkAnswer = (quizId: number) => {
   const quiz = quizzes.find(q => q.id === quizId);
   if (!quiz) return;
   
   const isCorrect = answers[quizId] === quiz.correct_answer;
   setResults(prev => ({...prev, [quizId]: isCorrect}));
 };

 return (
   <div className="max-w-4xl mx-auto p-4">
     <h1 className="text-2xl font-bold mb-4">クイズ一覧</h1>
     {quizzes.map((quiz) => (
       <div key={quiz.id} className="border p-4 rounded-lg mb-4">
         <h2 className="font-bold">{quiz.question}</h2>
         <div className="mt-2 space-y-2">
           {quiz.options.map((option, index) => (
             <div key={index} className="ml-4">
               <label className="flex items-center space-x-2">
                 <input
                   type="radio"
                   name={`quiz-${quiz.id}`}
                   value={index}
                   onChange={() => handleAnswer(quiz.id, index)}
                   disabled={results[quiz.id] !== undefined}
                 />
                 <span>{option}</span>
               </label>
             </div>
           ))}
         </div>
         {answers[quiz.id] !== undefined && !results[quiz.id] && (
           <button
             onClick={() => checkAnswer(quiz.id)}
             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
           >
             回答する
           </button>
         )}
         {results[quiz.id] !== undefined && (
           <div className={`mt-4 p-2 rounded ${results[quiz.id] ? 'bg-green-100' : 'bg-red-100'}`}>
             {results[quiz.id] ? '正解！' : '不正解...'}
             {quiz.explanation && <p className="mt-2">{quiz.explanation}</p>}
           </div>
         )}
       </div>
     ))}
   </div>
 );
}