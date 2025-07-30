const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const projectCount = await pool.query('SELECT COUNT(*) FROM projects');
    const stageCount = await pool.query('SELECT COUNT(*) FROM stages');
    const taskCount = await pool.query('SELECT COUNT(*) FROM tasks');
    
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      message: 'API is working with Neon database!',
      database: 'Connected',
      data: {
        projects: parseInt(projectCount.rows[0].count),
        stages: parseInt(stageCount.rows[0].count),
        tasks: parseInt(taskCount.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      message: 'Database connection failed',
      database: 'Disconnected',
      error: error.message
    });
  }
}