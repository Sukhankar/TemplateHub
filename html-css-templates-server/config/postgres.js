import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URI;

export const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString && connectionString.includes('sslmode=require') 
    ? { rejectUnauthorized: false } 
    : false
});

export const connectPostgres = async () => {
  if (!connectionString) {
    console.log('⚠️ DATABASE_URL not set in environment. Skipping PostgreSQL connection.');
    return;
  }
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Neon PostgreSQL Connected Successfully at:', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL Connection Error:', err.message);
  }
};

export default connectPostgres;
