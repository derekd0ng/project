export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  projectId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  responsiblePerson: string;
  stageId: string;
  completed: boolean;
  createdAt: string;
}