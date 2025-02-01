// src/lib/db/check-quizzes.mjs
import { createClient } from '@vercel/postgres';

async function checkQuizzes() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    
    console.log('\n=== Difficulty Levels ===');
    const difficultyLevels = await client.query('SELECT * FROM difficulty_levels');
    console.log(difficultyLevels.rows);

    console.log('\n=== Quizzes with Difficulty ===');
    const quizzes = await client.query(`
      SELECT 
        q.id, 
        q.question, 
        q.difficulty_id,
        d.name as difficulty_name,
        c.title as chapter_title, 
        b.title as book_title
      FROM quizzes q
      JOIN chapters c ON c.id = q.chapter_id
      JOIN books b ON b.id = c.book_id
      LEFT JOIN difficulty_levels d ON d.id = q.difficulty_id
      WHERE b.title = 'Optipediaスペックル'
      ORDER BY q.difficulty_id;
    `);
    console.log(quizzes.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkQuizzes();