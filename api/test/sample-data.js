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
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize database
  await initializeDatabase();

  try {
    // Create sample project
    const projectResult = await pool.query(
      'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *',
      ['Test Project', 'A sample project created for testing database functionality']
    );
    const project = projectResult.rows[0];

    // Create sample stages
    const stageResults = await Promise.all([
      pool.query(
        'INSERT INTO stages (name, description, project_id) VALUES ($1, $2, $3) RETURNING *',
        ['Planning', 'Initial planning and requirements gathering', project.id]
      ),
      pool.query(
        'INSERT INTO stages (name, description, project_id) VALUES ($1, $2, $3) RETURNING *',
        ['Development', 'Implementation and coding phase', project.id]
      ),
      pool.query(
        'INSERT INTO stages (name, description, project_id) VALUES ($1, $2, $3) RETURNING *',
        ['Testing', 'Quality assurance and testing phase', project.id]
      )
    ]);

    const stages = stageResults.map(result => result.rows[0]);

    // Create sample tasks
    const taskPromises = [];
    stages.forEach((stage, index) => {
      const taskCount = 2 + index; // 2, 3, 4 tasks per stage
      for (let i = 0; i < taskCount; i++) {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + (index * 7) + (i * 2)); // Spread deadlines
        
        taskPromises.push(
          pool.query(
            'INSERT INTO tasks (title, description, deadline, responsible_person, stage_id, completed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
              `${stage.name} Task ${i + 1}`,
              `Sample task ${i + 1} for ${stage.name.toLowerCase()} stage`,
              deadline.toISOString().split('T')[0],
              `Team Member ${i + 1}`,
              stage.id,
              Math.random() > 0.7 // 30% chance of being completed
            ]
          )
        );
      }
    });

    const taskResults = await Promise.all(taskPromises);
    const tasks = taskResults.map(result => result.rows[0]);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Sample data created successfully',
      data: {
        project: project,
        stages: stages,
        tasks: tasks,
        summary: {
          projects_created: 1,
          stages_created: stages.length,
          tasks_created: tasks.length
        }
      }
    });
  } catch (error) {
    console.error('Failed to create sample data:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create sample data',
      error: error.message
    });
  }
};