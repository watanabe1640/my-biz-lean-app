// src/lib/db/setup-optipedia.mjs
import { createClient } from '@vercel/postgres';
import fs from 'fs/promises';

async function setupOptipedia() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    const migration = await fs.readFile('./src/lib/db/migrations/006_delete_and_add_optipedia_speckle.sql', 'utf8');
    await client.query(migration);
    console.log('Reset and added Optipedia speckle content successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

setupOptipedia();