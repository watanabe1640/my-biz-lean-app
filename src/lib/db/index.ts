// src/lib/db/index.ts
import { sql } from '@vercel/postgres';
import { VercelPoolClient } from '@vercel/postgres';

export async function query(text: string, params?: any[]) {
 try {
   const result = await sql.query(text, params);
   return result;
 } catch (error) {
   console.error('Database error:', error);
   throw error;
 }
}

// 型定義
export interface User {
 id: number;
 name: string;
 email: string;
 password: string;
 created_at: Date;
}

export interface Quiz {
 id: number;
 question: string;
 options: string[];
 correct_answer: number;
 image_url?: string;
 created_at: Date;
}