# Employee Details Portal

A full-stack web application for managing employee information, built with Angular 3 and Node.js 17.

## Project Overview

This project is part of the SCRUM-33 Epic: Version Downgrade & Migration for the Employee Details Portal. The application follows a stage-by-stage development approach with full Jira-GitHub traceability.

### Tech Stack

**Frontend:**
- Angular 3.4.0
- TypeScript 2.2.0
- RxJS 5.0.1

**Backend:**
- Node.js 17.x
- Express 4.18.2
- CORS support
- Body Parser

## Project Structure

```
employee-details-portal/
├── backend/
│   ├── server.js          # Express server with CRUD API
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment configuration
├── frontend/
│   ├── src/
│   │   ├── app/          # Angular components
│   │   ├── environments/ # Environment configs
│   │   ├── index.html    # Main HTML file
│   │   ├── main.ts       # Bootstrap file
│   │   ├── polyfills.ts  # Browser polyfills
│   │   └── styles.css    # Global styles
│   ├── package.json      # Frontend dependencies
│   ├── tsconfig.json     # TypeScript configuration
│   └── .angular-cli.json # Angular CLI configuration
└── README.md
```

## Development Stages

### ✅ Stage 1: Project Setup & Infrastructure (SCRUM-37)
- [x] Initialize project structure
- [x] Configure Node.js 17 backend
- [x] Set up Angular 3 frontend
- [x] Create basic Express server with CRUD API
- [x] Configure development environment

### 🔄 Stage 2: Core Backend Development (SCRUM-38)
- [ ] Enhance API endpoints
- [ ] Add validation middleware
- [ ] Implement error handling
- [ ] Add API documentation

### 📋 Stage 3: Database Integration (SCRUM-39)
- [ ] Set up database connection
- [ ] Create employee schema
- [ ] Implement data persistence
- [ ] Add migrations

### 🎨 Stage 4: Frontend Angular Components (SCRUM-40)
- [ ] Employee list component
- [ ] Employee detail component
- [ ] Employee form component
- [ ] Routing configuration

### 🔗 Stage 5: API Integration & State Management (SCRUM-41)
- [ ] HTTP services
- [ ] State management
- [ ] Error handling
- [ ] Form validation

### ✅ Stage 6: Testing & Quality Assurance (SCRUM-42)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Bug fixes

### 📚 Stage 7: Documentation & Deployment (SCRUM-43)
- [ ] Complete documentation
- [ ] Deployment guide
- [ ] Production configuration

## Installation & Setup

### Prerequisites
- Node.js 17.x
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:4200`

## API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

## Employee Data Model

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "position": "Software Engineer",
  "joinDate": "2020-01-15"
}
```

## Development Workflow

1. **Jira Task Management**: Each stage has a corresponding Jira story
2. **Git Branching**: Feature branches for each stage
3. **Code Review**: Pull requests reviewed before merging
4. **Testing**: All code tested before stage completion
5. **Documentation**: Updated with each stage completion

## Jira Integration

- **Epic**: SCRUM-33 - Version Downgrade & Migration
- **Stories**: SCRUM-37 through SCRUM-43 (Stages 1-7)
- **Workflow**: To Do → In Progress → In Review → Done

## Contributing

This project follows a structured development approach with stage-by-stage implementation. Each stage must be completed and tested before moving to the next.

## License

ISC

## Contact

For questions or issues, please refer to the Jira board or contact the development team.

---

**Last Updated**: Stage 1 Complete - February 24, 2026
**Status**: Ready for Stage 2 Development