import axios from 'axios';
import type { Project, Stage, Task } from './types';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Project API
export const projectApi = {
  getAll: () => api.get<Project[]>('/projects'),
  create: (data: { name: string; description: string }) => api.post<Project>('/projects', data),
  update: (id: string, data: { name: string; description: string }) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Stage API
export const stageApi = {
  getByProject: (projectId: string) => api.get<Stage[]>('/stages', { params: { projectId } }),
  create: (data: { name: string; description: string; projectId: string }) => api.post<Stage>('/stages', data),
  update: (id: string, data: { name: string; description: string }) => api.put<Stage>(`/stages/${id}`, data),
  delete: (id: string) => api.delete(`/stages/${id}`),
};

// Task API
export const taskApi = {
  getByStage: (stageId: string) => api.get<Task[]>('/tasks', { params: { stageId } }),
  create: (data: { title: string; description: string; deadline: string; responsiblePerson: string; stageId: string }) => 
    api.post<Task>('/tasks', data),
  update: (id: string, data: { title?: string; description?: string; deadline?: string; responsiblePerson?: string; completed?: boolean }) => 
    api.put<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};