// src/lib/db/setup-sample.mjs
import { createClient } from '@vercel/postgres';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function setupSample() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });
  
  try {
    await client.connect();
    const migration = await fs.readFile('./src/lib/db/migrations/002_sample_data.sql', 'utf8');
    await client.query(migration);
    console.log('Sample data inserted successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

setupSample();