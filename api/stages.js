const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Helper function to handle database errors
const handleDbError = (res, error, message = 'Database error') => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

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

  try {
    switch (req.method) {
      case 'GET':
        const { projectId } = req.query;
        if (projectId) {
          const result = await pool.query(
            'SELECT * FROM stages WHERE project_id = $1 ORDER BY created_at ASC',
            [projectId]
          );
          res.status(200).json(result.rows);
        } else {
          const result = await pool.query('SELECT * FROM stages ORDER BY created_at DESC');
          res.status(200).json(result.rows);
        }
        break;

      case 'POST':
        const { name, description, project_id } = req.body;
        const createResult = await pool.query(
          'INSERT INTO stages (name, description, project_id) VALUES ($1, $2, $3) RETURNING *',
          [name, description, project_id]
        );
        res.status(201).json(createResult.rows[0]);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    handleDbError(res, error, 'Failed to handle stages request');
  }
};