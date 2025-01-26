// src/types/quiz.ts
export interface Quiz {
	id: number;
	question: string;
	options: string[];
	correctAnswer: number;
   }
   
   // src/app/api/quiz/route.ts
   import { createClient } from '@vercel/postgres';
   import { NextResponse } from 'next/server';
   
   export async function GET() {
	const client = createClient();
	await client.connect();
	
	const result = await client.query('SELECT * FROM quizzes');
	await client.end();
	
	return NextResponse.json(result.rows);
   }
   
   export async function POST(request: Request) {
	const client = createClient();
	await client.connect();
	
	const { question, options, correctAnswer } = await request.json();
	
	const result = await client.query(
	  'INSERT INTO quizzes (question, options, correct_answer) VALUES ($1, $2, $3) RETURNING *',
	  [question, options, correctAnswer]
	);
	
	await client.end();
	return NextResponse.json(result.rows[0]);
   }