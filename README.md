# Project Progress Tracker

A full-stack project management application built with Node.js API and React frontend, optimized for Vercel deployment.

## Features

- **Project Management**: Create and manage multiple projects
- **Stage Organization**: Organize work into stages within each project
- **Task Tracking**: Add tasks with deadlines and responsible persons
- **Checkbox Completion**: Mark tasks as completed with visual feedback
- **Overdue Detection**: Automatically highlight overdue tasks
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, TypeScript, Vite
- **Storage**: In-memory (ready for Neon database integration)
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/derekd0ng/project.git
cd project
```

2. Install dependencies:
```bash
npm run install-all
```

### Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- API server on http://localhost:5000
- React app on http://localhost:5173

### Individual Services

Run API server only:
```bash
npm run server
```

Run React app only:
```bash
npm run client
```

### Production Build

Build the client for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Stages
- `GET /api/stages?projectId=:projectId` - Get stages for a project
- `POST /api/stages` - Create a new stage
- `PUT /api/stages/:id` - Update a stage
- `DELETE /api/stages/:id` - Delete a stage

### Tasks
- `GET /api/tasks?stageId=:stageId` - Get tasks for a stage
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task (including completion status)
- `DELETE /api/tasks/:id` - Delete a task

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration from `vercel.json`
3. The app will be deployed with both API and frontend

### Environment Variables

No environment variables are required for the basic setup. The app uses in-memory storage by default.

## Future Enhancements

- [ ] Neon database integration
- [ ] User authentication
- [ ] Real-time updates
- [ ] File attachments
- [ ] Email notifications
- [ ] Advanced filtering and search
- [ ] Project templates
- [ ] Time tracking

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.