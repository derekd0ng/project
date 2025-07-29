# Project Progress Tracker - Claude Development Documentation

## Project Overview

This is a full-stack project management application built with Node.js API and React frontend, optimized for Vercel deployment. The app allows users to manage projects, organize them into stages, and track tasks with deadlines and responsible persons.

## Architecture

### Backend (Node.js + Express)
- **File**: `api/index.js`
- **Framework**: Express.js
- **Storage**: In-memory arrays (ready for database migration)
- **CORS**: Enabled for cross-origin requests
- **Port**: 5000 (development) / dynamic (production)

### Frontend (React + TypeScript + Vite)
- **Directory**: `client/`
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with responsive design
- **HTTP Client**: Axios for API communication

### Deployment
- **Platform**: Vercel
- **Configuration**: `vercel.json`
- **Build Process**: Automatic via Vercel

## Data Structure

### Projects
```typescript
interface Project {
  id: string;          // UUID
  name: string;        // Project name
  description: string; // Project description
  createdAt: string;   // ISO timestamp
}
```

### Stages
```typescript
interface Stage {
  id: string;          // UUID
  name: string;        // Stage name
  description: string; // Stage description
  projectId: string;   // Reference to parent project
  createdAt: string;   // ISO timestamp
}
```

### Tasks
```typescript
interface Task {
  id: string;             // UUID
  title: string;          // Task title
  description: string;    // Task description
  deadline: string;       // Date in YYYY-MM-DD format
  responsiblePerson: string; // Assigned person name
  stageId: string;        // Reference to parent stage
  completed: boolean;     // Completion status
  createdAt: string;      // ISO timestamp
}
```

## API Endpoints

### Projects
- `GET /api/projects` - Retrieve all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (cascades to stages/tasks)

### Stages
- `GET /api/stages?projectId=:id` - Get stages for a project
- `POST /api/stages` - Create new stage
- `PUT /api/stages/:id` - Update stage
- `DELETE /api/stages/:id` - Delete stage (cascades to tasks)

### Tasks
- `GET /api/tasks?stageId=:id` - Get tasks for a stage
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task (including completion toggle)
- `DELETE /api/tasks/:id` - Delete task

### Utility
- `GET /api/health` - Health check endpoint

## Key Features

### ✅ Project Management
- Create and manage multiple projects
- Edit project details
- Delete projects (with cascade deletion)

### ✅ Stage Organization
- Add stages within projects
- Organize workflow phases
- Stage-based task grouping

### ✅ Task Tracking
- Add tasks with detailed information
- Set deadlines and assign responsible persons
- Mark tasks as completed with checkbox
- Visual completion status

### ✅ Smart Features
- **Overdue Detection**: Tasks past deadline highlighted in red
- **Completion Visual**: Completed tasks show strikethrough text
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: UI updates immediately after API calls

## Development Commands

### Local Development
```bash
# Install dependencies
npm run install-all

# Start development servers (API + React)
npm run dev

# Start API server only
npm run server

# Start React client only
npm run client

# Build React app for production
npm run build
```

### Production Testing
```bash
# Run production server (single server for both API and frontend)
node production-server.js
```

## File Structure
```
project/
├── api/
│   └── index.js              # Express API server
├── client/
│   ├── src/
│   │   ├── App.tsx           # Main React component
│   │   ├── App.css           # Styling
│   │   ├── api.ts            # API client functions
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── main.tsx          # React entry point
│   ├── package.json          # Client dependencies
│   └── vite.config.ts        # Vite configuration
├── package.json              # Root package.json
├── vercel.json               # Vercel deployment config
├── .gitignore                # Git ignore rules
├── README.md                 # User documentation
└── CLAUDE.md                 # This development documentation
```

## Deployment Process

### Vercel Deployment
1. **Connect Repository**: Link GitHub repo to Vercel
2. **Automatic Detection**: Vercel reads `vercel.json` configuration
3. **Build Process**: 
   - API functions deployed as serverless functions
   - React app built and deployed as static files
4. **Routing**: API routes handled by serverless functions, all other routes serve React app

### Configuration Files
- **vercel.json**: Defines build and routing configuration
- **vite.config.ts**: Configures proxy for development
- **.gitignore**: Excludes build artifacts and dependencies

## Data Persistence

### Current: In-Memory Storage
- Data stored in JavaScript arrays
- Resets on server restart
- Suitable for demos and development

### Future: Database Integration
Ready for migration to Neon or other databases:
1. Replace array operations with database queries
2. Add database connection configuration
3. Implement proper data validation
4. Add database migrations

## Technical Decisions

### Why Vite over Create React App?
- Faster build times
- Better development experience
- Modern tooling
- Smaller bundle sizes

### Why In-Memory Storage?
- Quick prototyping
- No database setup required
- Easy to migrate to real database later
- Perfect for demos

### Why Vercel?
- Optimized for full-stack apps
- Automatic deployments
- Serverless functions for API
- Global CDN for frontend

## Known Limitations

1. **Data Persistence**: Data lost on server restart
2. **Concurrency**: No multi-user support
3. **Authentication**: No user system implemented
4. **Validation**: Basic client-side validation only
5. **Scalability**: In-memory storage not suitable for production

## Future Enhancements

### Phase 1: Database Integration
- [ ] Integrate Neon PostgreSQL database
- [ ] Add proper data validation
- [ ] Implement database migrations
- [ ] Add error handling for database operations

### Phase 2: User Management
- [ ] User authentication system
- [ ] Project ownership and permissions
- [ ] User profiles and settings
- [ ] Multi-tenant architecture

### Phase 3: Advanced Features
- [ ] Real-time collaboration
- [ ] File attachments
- [ ] Email notifications
- [ ] Advanced filtering and search
- [ ] Project templates
- [ ] Time tracking
- [ ] Reporting and analytics

### Phase 4: Performance & Scale
- [ ] Caching layer
- [ ] Database indexing
- [ ] API rate limiting
- [ ] Load balancing
- [ ] Monitoring and logging

## Development Notes

### Created by Claude
This project was built entirely by Claude (Anthropic's AI assistant) based on user requirements. The architecture follows modern best practices and is designed for maintainability and scalability.

### Build Process
The application uses a modern build pipeline:
- TypeScript for type safety
- Vite for fast development and building
- ESLint for code quality
- Responsive CSS for mobile-first design

### API Design
RESTful API following standard conventions:
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Consistent response formats
- Error handling with appropriate status codes
- CORS configuration for cross-origin requests

### Security Considerations
- CORS properly configured
- Input validation on API endpoints
- No sensitive data exposed in client code
- Ready for authentication layer addition

## Getting Started for Developers

1. **Clone and Setup**:
   ```bash
   git clone https://github.com/derekd0ng/project.git
   cd project
   npm run install-all
   ```

2. **Development**:
   ```bash
   npm run dev
   ```
   Access at http://localhost:5173

3. **Production Testing**:
   ```bash
   node production-server.js
   ```
   Access at http://localhost:3000

4. **Deploy to Vercel**:
   - Connect GitHub repo to Vercel
   - Deploy automatically

## Contributing

When contributing to this project:
1. Follow the existing code structure
2. Add TypeScript types for new features
3. Update this documentation for significant changes
4. Test both development and production builds
5. Ensure Vercel deployment compatibility

## Support

This project serves as a foundation for project management applications. It's designed to be extended and can be adapted for various use cases including:
- Team project management
- Personal task tracking
- Educational project organization
- Client work management
- Agile development workflows