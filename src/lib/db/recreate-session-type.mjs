// src/lib/db/recreate-session-type.mjs
import { createClient } from '@vercel/postgres';
import fs from 'fs/promises';

async function recreateSessionType() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    const migration = await fs.readFile('./src/lib/db/migrations/009_recreate_session_type.sql', 'utf8');
    await client.query(migration);
    console.log('Session type recreated successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

recreateSessionType();