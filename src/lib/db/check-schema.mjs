// src/lib/db/check-schema.mjs
import { createClient } from '@vercel/postgres';

async function checkSchema() {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });

  try {
    await client.connect();
    
    console.log('\n=== Tables ===');
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables
      WHERE schemaname = 'public'
    `);
    console.log(tables.rows);

    for (const table of tables.rows) {
      console.log(`\n=== ${table.tablename} Structure ===`);
      const columns = await client.query(`
        SELECT column_name, data_type, character_maximum_length
        FROM information_schema.columns
        WHERE table_name = $1
      `, [table.tablename]);
      console.log(columns.rows);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkSchema();