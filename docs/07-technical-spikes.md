# Employee Details Portal - Technical Spikes

## 1. Introduction

This document outlines technical spikes (research tasks) that need investigation before or during implementation. Spikes help reduce technical uncertainty and inform design decisions.

---

## 2. Spike Summary

| Spike ID | Title | Priority | Duration | Status |
|----------|-------|----------|----------|--------|
| SPIKE-001 | SQLite with better-sqlite3 | High | 4 hours | To Do |
| SPIKE-002 | React Charting Library Selection | High | 4 hours | To Do |
| SPIKE-003 | Form Validation Strategy | Medium | 2 hours | To Do |
| SPIKE-004 | Employee ID Generation | Medium | 2 hours | To Do |
| SPIKE-005 | Search Implementation | Medium | 4 hours | To Do |
| SPIKE-006 | Docker Containerization | Low | 4 hours | To Do |
| SPIKE-007 | Testing Strategy | High | 4 hours | To Do |

---

## 3. Detailed Spikes

### SPIKE-001: SQLite with better-sqlite3

| Attribute | Value |
|-----------|-------|
| **Spike ID** | SPIKE-001 |
| **Title** | SQLite Database Implementation with better-sqlite3 |
| **Priority** | High |
| **Time Box** | 4 hours |
| **Assigned To** | TBD |

#### Objective
Validate the use of `better-sqlite3` as the SQLite driver for Node.js and establish patterns for database operations.

#### Questions to Answer
1. How to set up better-sqlite3 connection and configuration?
2. How to handle database migrations?
3. How to implement transactions for multi-table operations?
4. What are the performance characteristics for our use case?
5. How to handle foreign key constraints?

#### Research Tasks
- [ ] Install and configure better-sqlite3
- [ ] Create database initialization script
- [ ] Test CRUD operations
- [ ] Implement and test foreign key cascade delete
- [ ] Test concurrent access patterns
- [ ] Document connection pooling options (if needed)

#### Proof of Concept Code

```javascript
// database.js - Connection setup
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/employees.db');
const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
const initSchema = () => {
  const schema = `
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      employee_id TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      department TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.exec(schema);
};

module.exports = { db, initSchema };

// Example CRUD operations
const employeeModel = {
  findAll: (limit = 10, offset = 0) => {
    const stmt = db.prepare('SELECT * FROM employees LIMIT ? OFFSET ?');
    return stmt.all(limit, offset);
  },
  
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM employees WHERE id = ?');
    return stmt.get(id);
  },
  
  create: (employee) => {
    const stmt = db.prepare(`
      INSERT INTO employees (id, employee_id, first_name, last_name, email, department)
      VALUES (@id, @employeeId, @firstName, @lastName, @email, @department)
    `);
    return stmt.run(employee);
  },
  
  update: (id, updates) => {
    const stmt = db.prepare(`
      UPDATE employees SET 
        first_name = @firstName,
        last_name = @lastName,
        email = @email,
        department = @department
      WHERE id = @id
    `);
    return stmt.run({ ...updates, id });
  },
  
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM employees WHERE id = ?');
    return stmt.run(id);
  }
};

// Transaction example
const createEmployeeWithAddress = (employee, address) => {
  const insertEmployee = db.prepare('INSERT INTO employees ...');
  const insertAddress = db.prepare('INSERT INTO addresses ...');
  
  const transaction = db.transaction((emp, addr) => {
    const empResult = insertEmployee.run(emp);
    insertAddress.run({ ...addr, employeeId: emp.id });
    return empResult;
  });
  
  return transaction(employee, address);
};
```

#### Success Criteria
- [ ] Database can be initialized with schema
- [ ] CRUD operations work correctly
- [ ] Foreign key constraints are enforced
- [ ] Cascade delete works for addresses
- [ ] Transactions rollback on error

#### Findings
*To be filled after spike completion*

---

### SPIKE-002: React Charting Library Selection

| Attribute | Value |
|-----------|-------|
| **Spike ID** | SPIKE-002 |
| **Title** | Evaluate Charting Libraries for Analytics Dashboard |
| **Priority** | High |
| **Time Box** | 4 hours |
| **Assigned To** | TBD |

#### Objective
Select the best charting library for the analytics dashboard based on features, bundle size, and ease of use.

#### Candidates
1. **Recharts** - Built on D3, React-specific
2. **Chart.js + react-chartjs-2** - Popular, widely used
3. **Victory** - Airbnb's charting library
4. **Nivo** - Rich, animated charts

#### Evaluation Criteria

| Criteria | Weight | Recharts | Chart.js | Victory | Nivo |
|----------|--------|----------|----------|---------|------|
| Ease of Use | 25% | ? | ? | ? | ? |
| Bundle Size | 20% | ? | ? | ? | ? |
| Customization | 20% | ? | ? | ? | ? |
| Documentation | 15% | ? | ? | ? | ? |
| Pie Chart Support | 20% | ? | ? | ? | ? |

#### Proof of Concept Code

```jsx
// Recharts Example
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DepartmentChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Chart.js Example
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DepartmentChartJS = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: COLORS,
    }]
  };
  
  return <Pie data={chartData} />;
};
```

#### Research Tasks
- [ ] Install each library and measure bundle impact
- [ ] Create pie chart with each library
- [ ] Test click-to-filter interaction
- [ ] Evaluate documentation quality
- [ ] Check mobile responsiveness
- [ ] Compare customization options

#### Success Criteria
- [ ] Library selected based on evaluation matrix
- [ ] Pie chart component prototype works
- [ ] Click interaction for drill-down tested
- [ ] Responsive on mobile screens

#### Recommendation
*To be filled after spike completion*

---

### SPIKE-003: Form Validation Strategy

| Attribute | Value |
|-----------|-------|
| **Spike ID** | SPIKE-003 |
| **Title** | Form Validation Approach for Employee Forms |
| **Priority** | Medium |
| **Time Box** | 2 hours |
| **Assigned To** | TBD |

#### Objective
Determine the best approach for form validation on both frontend and backend.

#### Candidates
**Frontend:**
1. Native HTML5 validation
2. React Hook Form + Yup/Zod
3. Formik + Yup
4. Custom validation hooks

**Backend:**
1. express-validator
2. Joi
3. Zod (shared with frontend)

#### Evaluation Criteria

| Criteria | React Hook Form | Formik | Custom |
|----------|-----------------|--------|--------|
| Bundle Size | Small | Medium | Minimal |
| Performance | Excellent | Good | Varies |
| Learning Curve | Low | Medium | Low |
| Error Handling | Good | Good | Manual |

#### Proof of Concept Code

```jsx
// React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  department: z.string().min(1, 'Department is required'),
  hireDate: z.string().min(1, 'Hire date is required'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Intern']),
});

const EmployeeForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(employeeSchema)
  });
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} />
      {errors.firstName && <span>{errors.firstName.message}</span>}
      
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};

// Backend express-validator
const { body, validationResult } = require('express-validator');

const validateEmployee = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('department').notEmpty().withMessage('Department is required'),
  body('hireDate').isISO8601().withMessage('Invalid date format'),
  body('employmentType').isIn(['Full-time', 'Part-time', 'Contract', 'Intern']),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  }
];
```

#### Success Criteria
- [ ] Validation approach selected
- [ ] Both frontend and backend validation patterns documented
- [ ] Error display strategy defined
- [ ] Shared validation schemas considered (Zod)

---

### SPIKE-004: Employee ID Generation

| Attribute | Value |
|-----------|-------|
| **Spike ID** | SPIKE-004 |
| **Title** | Employee ID Generation Strategy |
| **Priority** | Medium |
| **Time Box** | 2 hours |
| **Assigned To** | TBD |

#### Objective
Determine the best approach for generating unique, human-readable Employee IDs.

#### Approaches
1. **Sequential**: EMP-000001, EMP-000002, ...
2. **Year-based**: EMP-2024-0001
3. **UUID-based**: Shortened UUID
4. **Composite**: Department prefix + sequence

#### Requirements
- Must be unique across all employees
- Human-readable for easy reference
- Should not reveal total employee count (optional)
- Handle concurrent inserts without collision

#### Proof of Concept Code

```javascript
// Sequential approach with padding
const generateEmployeeId = (db) => {
  const result = db.prepare(
    'SELECT MAX(CAST(SUBSTR(employee_id, 5) AS INTEGER)) as maxId FROM employees'
  ).get();
  
  const nextId = (result.maxId || 0) + 1;
  return `EMP-${String(nextId).padStart(6, '0')}`;
};

// Year-based approach
const generateEmployeeIdYearly = (db) => {
  const year = new Date().getFullYear();
  const result = db.prepare(
    `SELECT MAX(CAST(SUBSTR(employee_id, 10) AS INTEGER)) as maxId 
     FROM employees 
     WHERE employee_id LIKE 'EMP-${year}-%'`
  ).get();
  
  const nextId = (result.maxId || 0) + 1;
  return `EMP-${year}-${String(nextId).padStart(4, '0')}`;
};

// Transaction-safe approach
const createEmployeeWithId = (db, employeeData) => {
  const insert = db.prepare(`
    INSERT INTO employees (id, employee_id, ...)
    VALUES (?, ?, ...)
  `);
  
  const getNextId = db.prepare(`
    SELECT MAX(CAST(SUBSTR(employee_id, 5) AS INTEGER)) as maxId 
    FROM employees
  `);
  
  const transaction = db.transaction((data) => {
    const result = getNextId.get();
    const nextId = (result.maxId || 0) + 1;
    const employeeId = `EMP-${String(nextId).padStart(6, '0')}`;
    
    insert.run(data.id, employeeId, ...);
    return employeeId;
  });
  
  return transaction(employeeData);
};
```

#### Success Criteria
- [ ] ID format selected
- [ ] Collision-free generation verified
- [ ] Performance tested under concurrent inserts

---

### SPIKE-005: Search Implementation

| Attribute | Value |
|-----------|-------|
| **Spike ID** | SPIKE-005 |
| **Title** | Employee Search Implementation |
| **Priority** | Medium |
| **Time Box** | 4 hours |
| **Assigned To** | TBD |

#### Objective
Design and validate the search implementation for both basic and advanced search features.

#### Approaches
1. **SQLite LIKE queries** - Simple, built-in
2. **SQLite FTS5** - Full-text search extension
3. **Application-level filtering** - Query all, filter in memory

#### Requirements
- Partial name matching
- Case-insensitive search
- Multi-field search (name, email, ID)
- Advanced filters (department, status, date range)
- Performance < 1 second for 10,000 records

#### Proof of Concept Code

```javascript
// Basic search with LIKE
const searchEmployees = (db, query) => {
  const searchTerm = `%${query}%`;
  const stmt = db.prepare(`
    SELECT * FROM employees 
    WHERE first_name LIKE ? 
       OR last_name LIKE ? 
       OR email LIKE ?
       OR employee_id LIKE ?
    LIMIT 50
  `);
  return stmt.all(searchTerm, searchTerm, searchTerm, searchTerm);
};

// Advanced search with multiple filters
const advancedSearch = (db, filters) => {
  let query = 'SELECT * FROM employees WHERE 1=1';
  const params = [];
  
  if (filters.query) {
    const searchTerm = `%${filters.query}%`;
    query += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  if (filters.department) {
    query += ` AND department = ?`;
    params.push(filters.department);
  }
  
  if (filters.status) {
    query += ` AND employment_status = ?`;
    params.push(filters.status);
  }
  
  if (filters.hireDateFrom) {
    query += ` AND hire_date >= ?`;
    params.push(filters.hireDateFrom);
  }
  
  if (filters.hireDateTo) {
    query += ` AND hire_date <= ?`;
    params.push(filters.hireDateTo);
  }
  
  // Pagination
  query += ` LIMIT ? OFFSET ?`;
  params.push(filters.limit || 10, filters.offset || 0);
  
  const stmt = db.prepare(query);
  return stmt.all(...params);
};

// FTS5 setup (if needed)
const setupFTS = (db) => {
  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS employees_fts 
    USING fts5(
      first_name, 
      last_name, 
      email, 
      department,
      content='employees',
      content_rowid='rowid'
    );
    
    -- Triggers to keep FTS in sync
    CREATE TRIGGER IF NOT EXISTS employees_ai AFTER INSERT ON employees BEGIN
      INSERT INTO employees_fts(rowid, first_name, last_name, email, department)
      VALUES (NEW.rowid, NEW.first_name, NEW.last_name, NEW.email, NEW.department);
    END;
  `);
};
```

#### Success Criteria
- [ ] Basic search works with partial matching
- [ ] Advanced search filters combine correctly
- [ ] Performance meets requirements
- [ ] Pagination works correctly

---

### SPIKE-006: Docker Containerization

| Attribute | Value |
|-----------|-------|
| **Spike ID** | SPIKE-006 |
| **Title** | Docker Setup for Development and Production |
| **Priority** | Low |
| **Time Box** | 4 hours |
| **Assigned To** | TBD |

#### Objective
Set up Docker containerization for consistent development and production environments.

#### Requirements
- Dockerfile for frontend (nginx serving React build)
- Dockerfile for backend (Node.js)
- Docker Compose for local development
- Volume for SQLite database persistence

#### Proof of Concept Code

```dockerfile
# Dockerfile.backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - DB_PATH=/app/data/employees.db

volumes:
  db-data:
```

#### Success Criteria
- [ ] Backend container runs correctly
- [ ] Frontend container builds and serves
- [ ] Docker Compose brings up full stack
- [ ] SQLite data persists between restarts

---

### SPIKE-007: Testing Strategy

| Attribute | Value |
|-----------|-------|
| **Spike ID** | SPIKE-007 |
| **Title** | Testing Framework Setup and Strategy |
| **Priority** | High |
| **Time Box** | 4 hours |
| **Assigned To** | TBD |

#### Objective
Set up testing frameworks and establish patterns for achieving >80% code coverage.

#### Testing Layers
1. **Unit Tests** - Functions, utilities, services
2. **Integration Tests** - API endpoints
3. **Component Tests** - React components
4. **E2E Tests** - Full user flows (future)

#### Tools
- **Jest** - Test runner
- **Supertest** - API testing
- **React Testing Library** - Component testing
- **MSW** - API mocking for frontend

#### Proof of Concept Code

```javascript
// Backend unit test - employeeService.test.js
const { generateEmployeeId } = require('../services/employeeService');

describe('Employee Service', () => {
  describe('generateEmployeeId', () => {
    it('should generate ID in correct format', () => {
      const id = generateEmployeeId(1);
      expect(id).toMatch(/^EMP-\d{6}$/);
    });
    
    it('should pad numbers correctly', () => {
      expect(generateEmployeeId(1)).toBe('EMP-000001');
      expect(generateEmployeeId(99999)).toBe('EMP-099999');
    });
  });
});

// Backend integration test - employees.api.test.js
const request = require('supertest');
const app = require('../app');

describe('Employee API', () => {
  describe('GET /api/employees', () => {
    it('should return paginated list', async () => {
      const res = await request(app)
        .get('/api/employees')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
  
  describe('POST /api/employees', () => {
    it('should create employee with valid data', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          department: 'Engineering',
          hireDate: '2024-01-15'
        })
        .expect(201);
      
      expect(res.body.data.employeeId).toMatch(/^EMP-/);
    });
    
    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({ email: 'invalid' })
        .expect(400);
      
      expect(res.body.success).toBe(false);
    });
  });
});

// Frontend component test - EmployeeCard.test.jsx
import { render, screen } from '@testing-library/react';
import { EmployeeCard } from './EmployeeCard';

const mockEmployee = {
  employeeId: 'EMP-000001',
  firstName: 'John',
  lastName: 'Smith',
  department: 'Engineering',
  position: 'Developer'
};

describe('EmployeeCard', () => {
  it('renders employee name', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });
  
  it('renders department and position', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });
});
```

#### Coverage Configuration

```javascript
// jest.config.js (backend)
module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ]
};
```

#### Success Criteria
- [ ] Jest configured for both frontend and backend
- [ ] Sample unit tests pass
- [ ] Sample integration tests pass
- [ ] Sample component tests pass
- [ ] Coverage reporting works

---

## 4. Spike Schedule

| Week | Spikes | Owner |
|------|--------|-------|
| Week 1 | SPIKE-001, SPIKE-002, SPIKE-007 | TBD |
| Week 2 | SPIKE-003, SPIKE-004, SPIKE-005 | TBD |
| Week 3 | SPIKE-006 | TBD |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-19 | System | Initial version |