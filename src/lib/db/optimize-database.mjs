// src/lib/db/optimize-database.mjs
import { createClient } from '@vercel/postgres';
import fs from 'fs/promises';

async function optimizeDatabase() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    const migration = await fs.readFile('./src/lib/db/migrations/007_optimize_database.sql', 'utf8');
    await client.query(migration);
    console.log('Database optimization completed successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

optimizeDatabase();