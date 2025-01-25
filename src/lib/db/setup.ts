// src/lib/db/setup.ts
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

async function setup() {
  try {
    const migrationFile = path.join(process.cwd(), 'src/lib/db/migrations/001_init.sql');
    const migration = fs.readFileSync(migrationFile, 'utf8');
    await sql.query(migration);
    console.log('Database setup completed');
  } catch (error) {
    console.error('Setup error:', error);
    throw error;
  }
}

setup();