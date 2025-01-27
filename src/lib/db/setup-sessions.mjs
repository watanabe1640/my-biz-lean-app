// src/lib/db/setup-sessions.mjs
import { createClient } from '@vercel/postgres';
import fs from 'fs/promises';

async function setupSessions() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    const migration = await fs.readFile('./src/lib/db/migrations/005_quiz_sessions.sql', 'utf8');
    await client.query(migration);
    console.log('Quiz sessions tables created successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

setupSessions();