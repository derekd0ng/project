const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database tables
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          deadline DATE NOT NULL,
          responsible_person VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_stages_project_id ON stages(project_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_stage_id ON tasks(stage_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

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

  // Initialize database on first request
  await initializeDatabase();

  try {
    switch (req.method) {
      case 'GET':
        const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.status(200).json(result.rows);
        break;

      case 'POST':
        const { name, description } = req.body;
        const createResult = await pool.query(
          'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *',
          [name, description]
        );
        res.status(201).json(createResult.rows[0]);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    handleDbError(res, error, 'Failed to handle projects request');
  }
};