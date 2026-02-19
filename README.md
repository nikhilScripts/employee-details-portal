# Employee Details Portal

A modern web application for managing employee information with a dashboard, CRUD operations, and analytics visualization.

## Features

- **Dashboard**: Visual analytics with charts showing employee distribution by department, status, type, and tenure
- **Employee Management**: Full CRUD operations for employee records
- **Address Management**: Support for multiple addresses per employee
- **Manager Hierarchy**: Track reporting relationships with circular reference prevention
- **Search & Filter**: Filter employees by department, status, and search by name/email/ID
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** with better-sqlite3 (embedded database)
- **Jest** for testing

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API calls

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`

### Running Locally
1. Start backend: `cd backend && npm start`
2. Seed database (optional): `npm run seed`
3. Start frontend: `cd frontend && npm run dev`

## Docker Deployment
```bash
docker-compose up -d
```

## GitHub Repository
- Repository: https://github.com/nikhilScripts/employee-details-portal

## License
MIT