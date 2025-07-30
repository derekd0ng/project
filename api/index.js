const express = require('express');
const cors = require('cors');
const { pool, initializeDatabase } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database on startup
initializeDatabase();

// Helper function to handle database errors
const handleDbError = (res, error, message = 'Database error') => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

// Project routes
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    handleDbError(res, error, 'Failed to fetch projects');
  }
});

app.post('/api/projects', async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    handleDbError(res, error, 'Failed to create project');
  }
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    handleDbError(res, error, 'Failed to update project');
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    handleDbError(res, error, 'Failed to delete project');
  }
});

// Stage routes
app.get('/api/stages', async (req, res) => {
  const { projectId } = req.query;
  
  try {
    let query = 'SELECT * FROM stages';
    let params = [];
    
    if (projectId) {
      query += ' WHERE project_id = $1';
      params = [projectId];
    }
    
    query += ' ORDER BY created_at ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    handleDbError(res, error, 'Failed to fetch stages');
  }
});

app.post('/api/stages', async (req, res) => {
  const { name, description, projectId } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO stages (name, description, project_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, projectId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    handleDbError(res, error, 'Failed to create stage');
  }
});

app.put('/api/stages/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE stages SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    handleDbError(res, error, 'Failed to update stage');
  }
});

app.delete('/api/stages/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM stages WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    handleDbError(res, error, 'Failed to delete stage');
  }
});

// Task routes
app.get('/api/tasks', async (req, res) => {
  const { stageId } = req.query;
  
  try {
    let query = 'SELECT * FROM tasks';
    let params = [];
    
    if (stageId) {
      query += ' WHERE stage_id = $1';
      params = [stageId];
    }
    
    query += ' ORDER BY created_at ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    handleDbError(res, error, 'Failed to fetch tasks');
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, deadline, responsiblePerson, stageId } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, deadline, responsible_person, stage_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, deadline, responsiblePerson, stageId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    handleDbError(res, error, 'Failed to create task');
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, responsiblePerson, completed } = req.body;
  
  try {
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (deadline !== undefined) {
      updates.push(`deadline = $${paramCount++}`);
      values.push(deadline);
    }
    if (responsiblePerson !== undefined) {
      updates.push(`responsible_person = $${paramCount++}`);
      values.push(responsiblePerson);
    }
    if (completed !== undefined) {
      updates.push(`completed = $${paramCount++}`);
      values.push(completed);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    handleDbError(res, error, 'Failed to update task');
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    handleDbError(res, error, 'Failed to delete task');
  }
});

// Health check with database stats
app.get('/api/health', async (req, res) => {
  try {
    const projectCount = await pool.query('SELECT COUNT(*) FROM projects');
    const stageCount = await pool.query('SELECT COUNT(*) FROM stages');
    const taskCount = await pool.query('SELECT COUNT(*) FROM tasks');
    
    res.json({ 
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
});

// Database testing endpoints

// Test database connection
app.get('/api/test/connection', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    res.json({
      status: 'SUCCESS',
      message: 'Database connection test successful',
      data: {
        current_time: result.rows[0].current_time,
        database_version: result.rows[0].version,
        connection_pool: {
          total_connections: pool.totalCount,
          idle_connections: pool.idleCount,
          waiting_connections: pool.waitingCount
        }
      }
    });
  } catch (error) {
    handleDbError(res, error, 'Database connection test failed');
  }
});

// Test database tables exist
app.get('/api/test/tables', async (req, res) => {
  try {
    const tablesQuery = `
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('projects', 'stages', 'tasks')
      ORDER BY table_name, ordinal_position
    `;
    
    const result = await pool.query(tablesQuery);
    
    // Group columns by table
    const tables = {};
    result.rows.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES'
      });
    });
    
    res.json({
      status: 'SUCCESS',
      message: 'Database schema information',
      data: {
        tables: tables,
        table_count: Object.keys(tables).length
      }
    });
  } catch (error) {
    handleDbError(res, error, 'Failed to fetch table information');
  }
});

// Create sample data for testing
app.post('/api/test/sample-data', async (req, res) => {
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
    handleDbError(res, error, 'Failed to create sample data');
  }
});

// Get all data with relationships
app.get('/api/test/all-data', async (req, res) => {
  try {
    const projectsResult = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    const stagesResult = await pool.query('SELECT * FROM stages ORDER BY created_at ASC');
    const tasksResult = await pool.query('SELECT * FROM tasks ORDER BY created_at ASC');

    // Build hierarchical structure
    const projects = projectsResult.rows.map(project => ({
      ...project,
      stages: stagesResult.rows
        .filter(stage => stage.project_id === project.id)
        .map(stage => ({
          ...stage,
          tasks: tasksResult.rows.filter(task => task.stage_id === stage.id)
        }))
    }));

    res.json({
      status: 'SUCCESS',
      message: 'All data retrieved with relationships',
      data: {
        projects: projects,
        summary: {
          total_projects: projectsResult.rows.length,
          total_stages: stagesResult.rows.length,
          total_tasks: tasksResult.rows.length,
          completed_tasks: tasksResult.rows.filter(t => t.completed).length
        }
      }
    });
  } catch (error) {
    handleDbError(res, error, 'Failed to fetch all data');
  }
});

// Clear all data (for testing)
app.delete('/api/test/clear-data', async (req, res) => {
  try {
    // Delete in reverse order due to foreign key constraints
    const taskResult = await pool.query('DELETE FROM tasks');
    const stageResult = await pool.query('DELETE FROM stages');
    const projectResult = await pool.query('DELETE FROM projects');

    res.json({
      status: 'SUCCESS',
      message: 'All data cleared successfully',
      data: {
        tasks_deleted: taskResult.rowCount,
        stages_deleted: stageResult.rowCount,
        projects_deleted: projectResult.rowCount
      }
    });
  } catch (error) {
    handleDbError(res, error, 'Failed to clear data');
  }
});

// Test database performance
app.get('/api/test/performance', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Run multiple queries to test performance
    const queries = [
      pool.query('SELECT COUNT(*) FROM projects'),
      pool.query('SELECT COUNT(*) FROM stages'),
      pool.query('SELECT COUNT(*) FROM tasks'),
      pool.query('SELECT COUNT(*) FROM tasks WHERE completed = true'),
      pool.query('SELECT COUNT(*) FROM tasks WHERE deadline < NOW()'),
    ];

    const results = await Promise.all(queries);
    const endTime = Date.now();

    res.json({
      status: 'SUCCESS',
      message: 'Database performance test completed',
      data: {
        execution_time_ms: endTime - startTime,
        queries_executed: queries.length,
        results: {
          total_projects: parseInt(results[0].rows[0].count),
          total_stages: parseInt(results[1].rows[0].count),
          total_tasks: parseInt(results[2].rows[0].count),
          completed_tasks: parseInt(results[3].rows[0].count),
          overdue_tasks: parseInt(results[4].rows[0].count)
        }
      }
    });
  } catch (error) {
    handleDbError(res, error, 'Database performance test failed');
  }
});

// For Vercel serverless functions
module.exports = app;