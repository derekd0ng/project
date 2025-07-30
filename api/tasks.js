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
        const { stageId } = req.query;
        if (stageId) {
          const result = await pool.query(
            'SELECT * FROM tasks WHERE stage_id = $1 ORDER BY deadline ASC, created_at ASC',
            [stageId]
          );
          res.status(200).json(result.rows);
        } else {
          const result = await pool.query('SELECT * FROM tasks ORDER BY deadline ASC, created_at DESC');
          res.status(200).json(result.rows);
        }
        break;

      case 'POST':
        const { title, description, deadline, responsible_person, stage_id } = req.body;
        const createResult = await pool.query(
          'INSERT INTO tasks (title, description, deadline, responsible_person, stage_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [title, description, deadline, responsible_person, stage_id]
        );
        res.status(201).json(createResult.rows[0]);
        break;

      case 'PUT':
        const { id } = req.query;
        const updateData = req.body;
        
        // Build dynamic update query
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        Object.keys(updateData).forEach(key => {
          if (key !== 'id') {
            updateFields.push(`${key} = $${paramIndex}`);
            updateValues.push(updateData[key]);
            paramIndex++;
          }
        });

        if (updateFields.length === 0) {
          return res.status(400).json({ error: 'No fields to update' });
        }

        updateValues.push(id);
        const updateQuery = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        
        const updateResult = await pool.query(updateQuery, updateValues);
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(updateResult.rows[0]);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    handleDbError(res, error, 'Failed to handle tasks request');
  }
};