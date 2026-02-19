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

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── database/      # Database initialization
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── scripts/       # Utility scripts (seed data)
│   │   ├── app.js         # Express app
│   │   └── server.js      # Server entry point
│   └── tests/             # Unit and integration tests
├── frontend/
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── ...
├── docs/                  # Requirements and documentation
└── docker-compose.yml     # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/employee-details-portal.git
cd employee-details-portal
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running Locally

1. Start the backend server:
```bash
cd backend
npm start
```
The API will be available at http://localhost:3000

2. Seed the database (optional):
```bash
npm run seed
```

3. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The application will be available at http://localhost:5173

### Running Tests

Backend tests:
```bash
cd backend
npm test
npm run test:coverage  # With coverage report
```

Frontend tests:
```bash
cd frontend
npm test
npm run test:coverage  # With coverage report
```

## Docker Deployment

Build and run with Docker Compose:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:80
- Backend API: http://localhost:3000

## API Endpoints

### Employees
- `GET /api/employees` - List employees (paginated, filterable)
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/managers` - List potential managers

### Addresses
- `GET /api/employees/:id/addresses` - Get employee addresses
- `POST /api/employees/:id/addresses` - Add address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Analytics
- `GET /api/analytics/summary` - Dashboard summary stats
- `GET /api/analytics/department` - Employees by department
- `GET /api/analytics/status` - Employees by status
- `GET /api/analytics/type` - Employees by type
- `GET /api/analytics/tenure` - Employees by tenure
- `GET /api/analytics/location` - Employees by location

## Documentation

Detailed documentation is available in the `docs/` folder:
- Requirements specifications
- Functional requirements
- Architecture design
- Testing plan
- User stories

## License

MIT