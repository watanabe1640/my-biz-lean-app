// src/lib/db/setup-images.mjs
import { createClient } from '@vercel/postgres';
import fs from 'fs/promises';

async function setupImages() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    const migration = await fs.readFile('./src/lib/db/migrations/004_add_images.sql', 'utf8');
    await client.query(migration);
    console.log('Added image columns successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

setupImages();