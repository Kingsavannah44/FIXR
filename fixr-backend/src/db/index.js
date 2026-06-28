if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('user:password')) {
  console.log('⚠️  No DATABASE_URL set — using in-memory mock DB (demo mode)');
  module.exports = require('./mock');
} else {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.on('error', (err) => console.error('DB pool error:', err));
  module.exports = { query: (text, params) => pool.query(text, params) };
}
