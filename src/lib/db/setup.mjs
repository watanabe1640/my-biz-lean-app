import { createClient } from '@vercel/postgres';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

async function setup() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });
  
  try {
    await client.connect();
    const migration = await fs.readFile('./src/lib/db/migrations/001_init.sql', 'utf8');
    await client.query(migration);
    console.log('Migration complete');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

setup();