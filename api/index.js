const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage
let projects = [];
let stages = [];
let tasks = [];

// Project routes
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const { name, description } = req.body;
  const project = {
    id: uuidv4(),
    name,
    description,
    createdAt: new Date().toISOString()
  };
  projects.push(project);
  res.status(201).json(project);
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  const projectIndex = projects.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  projects[projectIndex] = { ...projects[projectIndex], name, description };
  res.json(projects[projectIndex]);
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  // Remove associated stages and tasks
  stages = stages.filter(s => s.projectId !== id);
  tasks = tasks.filter(t => !stages.some(s => s.id === t.stageId && s.projectId === id));
  
  projects.splice(projectIndex, 1);
  res.status(204).send();
});

// Stage routes
app.get('/api/stages', (req, res) => {
  const { projectId } = req.query;
  if (projectId) {
    const projectStages = stages.filter(s => s.projectId === projectId);
    return res.json(projectStages);
  }
  res.json(stages);
});

app.post('/api/stages', (req, res) => {
  const { name, description, projectId } = req.body;
  const stage = {
    id: uuidv4(),
    name,
    description,
    projectId,
    createdAt: new Date().toISOString()
  };
  stages.push(stage);
  res.status(201).json(stage);
});

app.put('/api/stages/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  const stageIndex = stages.findIndex(s => s.id === id);
  if (stageIndex === -1) {
    return res.status(404).json({ error: 'Stage not found' });
  }
  
  stages[stageIndex] = { ...stages[stageIndex], name, description };
  res.json(stages[stageIndex]);
});

app.delete('/api/stages/:id', (req, res) => {
  const { id } = req.params;
  const stageIndex = stages.findIndex(s => s.id === id);
  
  if (stageIndex === -1) {
    return res.status(404).json({ error: 'Stage not found' });
  }
  
  // Remove associated tasks
  tasks = tasks.filter(t => t.stageId !== id);
  
  stages.splice(stageIndex, 1);
  res.status(204).send();
});

// Task routes
app.get('/api/tasks', (req, res) => {
  const { stageId } = req.query;
  if (stageId) {
    const stageTasks = tasks.filter(t => t.stageId === stageId);
    return res.json(stageTasks);
  }
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, deadline, responsiblePerson, stageId } = req.body;
  const task = {
    id: uuidv4(),
    title,
    description,
    deadline,
    responsiblePerson,
    stageId,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, responsiblePerson, completed } = req.body;
  
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = { 
    ...tasks[taskIndex], 
    title, 
    description, 
    deadline, 
    responsiblePerson,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed
  };
  res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill existing processes.`);
  }
  process.exit(1);
});

module.exports = app;