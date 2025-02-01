// src/lib/db/update-session-type.mjs
import { createClient } from '@vercel/postgres';
import fs from 'fs/promises';

async function addSessionType() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    const migration = await fs.readFile('./src/lib/db/migrations/008_add_session_type.sql', 'utf8');
    await client.query(migration);
    console.log('Session type enum updated successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

addSessionType();