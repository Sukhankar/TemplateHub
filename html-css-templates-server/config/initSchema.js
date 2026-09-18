import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initPostgresSchema = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(sql);
    console.log('✅ Neon PostgreSQL Database Tables Initialized (users, templates, purchases, reviews, notifications)');
  } catch (err) {
    console.error('❌ Failed to initialize PostgreSQL Schema:', err.message);
  }
};

export default initPostgresSchema;
