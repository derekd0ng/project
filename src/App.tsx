import React, { useState, useEffect } from 'react';
import type { Project, Stage, Task } from './types';
import { projectApi, stageApi, taskApi } from './api';
import './App.css';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<{ [stageId: string]: Task[] }>({});
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showStageForm, setShowStageForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadStages(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const response = await projectApi.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadStages = async (projectId: string) => {
    try {
      const response = await stageApi.getByProject(projectId);
      setStages(response.data);
      
      // Load tasks for each stage
      const stageTasksPromises = response.data.map(async (stage) => {
        const tasksResponse = await taskApi.getByStage(stage.id);
        return { stageId: stage.id, tasks: tasksResponse.data };
      });
      
      const stageTasksResults = await Promise.all(stageTasksPromises);
      const tasksMap: { [stageId: string]: Task[] } = {};
      stageTasksResults.forEach(({ stageId, tasks: stageTasks }) => {
        tasksMap[stageId] = stageTasks;
      });
      setTasks(tasksMap);
    } catch (error) {
      console.error('Error loading stages:', error);
    }
  };

  const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    try {
      await projectApi.create({ name, description });
      setShowProjectForm(false);
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCreateStage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProject) return;

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    try {
      await stageApi.create({ name, description, projectId: selectedProject.id });
      setShowStageForm(false);
      loadStages(selectedProject.id);
    } catch (error) {
      console.error('Error creating stage:', error);
    }
  };

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>, stageId: string) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const deadline = formData.get('deadline') as string;
    const responsiblePerson = formData.get('responsiblePerson') as string;

    try {
      await taskApi.create({ title, description, deadline, responsiblePerson, stageId });
      setShowTaskForm(null);
      if (selectedProject) {
        loadStages(selectedProject.id);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      await taskApi.update(task.id, { completed: !task.completed });
      if (selectedProject) {
        loadStages(selectedProject.id);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && !deadline.includes('T');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Project Progress Tracker</h1>
      </header>

      <div className="app-content">
        <div className="sidebar">
          <div className="projects-section">
            <div className="section-header">
              <h2>Projects</h2>
              <button onClick={() => setShowProjectForm(true)} className="btn-primary">
                + New Project
              </button>
            </div>

            <div className="projects-list">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>

            {showProjectForm && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Create New Project</h3>
                  <form onSubmit={handleCreateProject}>
                    <div className="form-group">
                      <label>Name:</label>
                      <input type="text" name="name" required />
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea name="description" required />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">Create</button>
                      <button type="button" onClick={() => setShowProjectForm(false)} className="btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="main-content">
          {selectedProject ? (
            <div className="project-details">
              <div className="project-header">
                <h2>{selectedProject.name}</h2>
                <button onClick={() => setShowStageForm(true)} className="btn-primary">
                  + New Stage
                </button>
              </div>

              <div className="stages-container">
                {stages.map((stage) => (
                  <div key={stage.id} className="stage-card">
                    <div className="stage-header">
                      <h3>{stage.name}</h3>
                      <button
                        onClick={() => setShowTaskForm(stage.id)}
                        className="btn-secondary"
                      >
                        + Add Task
                      </button>
                    </div>
                    <p className="stage-description">{stage.description}</p>

                    <div className="tasks-list">
                      {(tasks[stage.id] || []).map((task) => (
                        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue(task.deadline) && !task.completed ? 'overdue' : ''}`}>
                          <div className="task-checkbox">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleTask(task)}
                            />
                          </div>
                          <div className="task-content">
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <div className="task-meta">
                              <span className="deadline">Due: {formatDate(task.deadline)}</span>
                              <span className="responsible">Assigned to: {task.responsiblePerson}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {showTaskForm === stage.id && (
                      <div className="task-form">
                        <h4>Add New Task</h4>
                        <form onSubmit={(e) => handleCreateTask(e, stage.id)}>
                          <div className="form-group">
                            <label>Title:</label>
                            <input type="text" name="title" required />
                          </div>
                          <div className="form-group">
                            <label>Description:</label>
                            <textarea name="description" required />
                          </div>
                          <div className="form-group">
                            <label>Deadline:</label>
                            <input type="date" name="deadline" required />
                          </div>
                          <div className="form-group">
                            <label>Responsible Person:</label>
                            <input type="text" name="responsiblePerson" required />
                          </div>
                          <div className="form-actions">
                            <button type="submit" className="btn-primary">Add Task</button>
                            <button type="button" onClick={() => setShowTaskForm(null)} className="btn-secondary">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {showStageForm && (
                <div className="modal">
                  <div className="modal-content">
                    <h3>Create New Stage</h3>
                    <form onSubmit={handleCreateStage}>
                      <div className="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" required />
                      </div>
                      <div className="form-group">
                        <label>Description:</label>
                        <textarea name="description" required />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">Create</button>
                        <button type="button" onClick={() => setShowStageForm(false)} className="btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-project-selected">
              <h2>Select a project to get started</h2>
              <p>Choose a project from the sidebar or create a new one to begin tracking progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
