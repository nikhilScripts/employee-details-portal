# Employee Details Portal - Architecture Document

## 1. Introduction

This document describes the technical architecture for the Employee Details Portal, a full-stack web application built using React, Node.js, and SQLite.

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         React Frontend (SPA)                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │Dashboard │ │Employee  │ │ Search   │ │Analytics │ │  Forms   │  │   │
│  │  │   Page   │ │  List    │ │Components│ │  Charts  │ │Components│  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                              HTTP/REST API                                  │
│                                     │                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              APPLICATION LAYER                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Node.js + Express Backend                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │  Routes  │ │Controllers│ │ Services │ │Middleware│ │  Utils   │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                DATA LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           SQLite Database                            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                             │   │
│  │  │Employees │ │Addresses │ │  (Audit) │                             │   │
│  │  │  Table   │ │  Table   │ │  Table   │                             │   │
│  │  └──────────┘ └──────────┘ └──────────┘                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | React | 18.x | UI Framework |
| Frontend | React Router | 6.x | Client-side routing |
| Frontend | Recharts | 2.x | Data visualization |
| Frontend | Axios | 1.x | HTTP client |
| Frontend | Tailwind CSS | 3.x | Styling |
| Backend | Node.js | 18.x LTS | Runtime environment |
| Backend | Express | 4.x | Web framework |
| Backend | better-sqlite3 | 9.x | SQLite driver |
| Backend | express-validator | 7.x | Input validation |
| Backend | cors | 2.x | Cross-origin support |
| Testing | Jest | 29.x | Unit testing |
| Testing | React Testing Library | 14.x | Component testing |
| Testing | Supertest | 6.x | API testing |

---

## 3. Project Structure

```
employee-portal/
├── frontend/                    # React frontend application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Shared components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Pagination.jsx
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── employee/       # Employee-specific components
│   │   │   │   ├── EmployeeForm.jsx
│   │   │   │   ├── EmployeeCard.jsx
│   │   │   │   ├── EmployeeList.jsx
│   │   │   │   └── AddressForm.jsx
│   │   │   ├── search/         # Search components
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── AdvancedSearch.jsx
│   │   │   └── charts/         # Analytics components
│   │   │       ├── PieChart.jsx
│   │   │       └── SummaryCard.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmployeeListPage.jsx
│   │   │   ├── EmployeeProfile.jsx
│   │   │   ├── AddEmployee.jsx
│   │   │   ├── EditEmployee.jsx
│   │   │   └── Analytics.jsx
│   │   ├── services/           # API service layer
│   │   │   ├── api.js          # Axios instance
│   │   │   ├── employeeService.js
│   │   │   ├── addressService.js
│   │   │   └── analyticsService.js
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useEmployees.js
│   │   │   ├── useSearch.js
│   │   │   └── useAnalytics.js
│   │   ├── context/            # React Context
│   │   │   └── AppContext.jsx
│   │   ├── utils/              # Utility functions
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   ├── styles/             # Global styles
│   │   │   └── index.css
│   │   ├── App.jsx             # Root component
│   │   ├── index.jsx           # Entry point
│   │   └── routes.jsx          # Route definitions
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                     # Node.js backend application
│   ├── src/
│   │   ├── config/             # Configuration
│   │   │   ├── database.js     # DB connection
│   │   │   └── config.js       # App config
│   │   ├── routes/             # API routes
│   │   │   ├── index.js        # Route aggregator
│   │   │   ├── employeeRoutes.js
│   │   │   ├── addressRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── controllers/        # Request handlers
│   │   │   ├── employeeController.js
│   │   │   ├── addressController.js
│   │   │   └── analyticsController.js
│   │   ├── services/           # Business logic
│   │   │   ├── employeeService.js
│   │   │   ├── addressService.js
│   │   │   └── analyticsService.js
│   │   ├── models/             # Data access layer
│   │   │   ├── employeeModel.js
│   │   │   └── addressModel.js
│   │   ├── middleware/         # Express middleware
│   │   │   ├── errorHandler.js
│   │   │   ├── validator.js
│   │   │   └── logger.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── idGenerator.js
│   │   │   └── responseHelper.js
│   │   ├── database/           # Database scripts
│   │   │   ├── schema.sql      # DB schema
│   │   │   ├── seed.sql        # Seed data
│   │   │   └── migrations/     # Migration scripts
│   │   └── app.js              # Express app setup
│   ├── tests/                  # Test files
│   │   ├── unit/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   └── integration/
│   │       └── api/
│   ├── package.json
│   └── server.js               # Server entry point
│
├── docs/                        # Documentation
│   ├── 01-detailed-requirements.md
│   ├── 02-functional-requirements.md
│   ├── 03-non-functional-requirements.md
│   ├── 04-user-journeys.md
│   ├── 05-user-stories.md
│   ├── 06-architecture.md
│   ├── 07-technical-spikes.md
│   └── 08-testing-plan.md
│
├── deployment/                  # Deployment configs
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── .gitignore
├── README.md
└── package.json                 # Root package.json (workspaces)
```

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────────────────────┐      ┌─────────────────────────────────┐  │
│  │         EMPLOYEES           │      │          ADDRESSES               │  │
│  ├─────────────────────────────┤      ├─────────────────────────────────┤  │
│  │ PK  id (TEXT)              │      │ PK  id (TEXT)                   │  │
│  │     employee_id (TEXT) UQ  │      │ FK  employee_id (TEXT)          │  │
│  │     first_name (TEXT)      │      │     street_address (TEXT)       │  │
│  │     last_name (TEXT)       │      │     address_line2 (TEXT)        │  │
│  │     email (TEXT) UQ        │      │     city (TEXT)                 │  │
│  │     phone (TEXT)           │◄─────┤     state (TEXT)                │  │
│  │     date_of_birth (DATE)   │  1:N │     postal_code (TEXT)          │  │
│  │     hire_date (DATE)       │      │     country (TEXT)              │  │
│  │     department (TEXT)      │      │     address_type (TEXT)         │  │
│  │     position (TEXT)        │      │     created_at (DATETIME)       │  │
│  │     employment_status (TEXT)│      │     updated_at (DATETIME)       │  │
│  │     employment_type (TEXT) │      └─────────────────────────────────┘  │
│  │ FK  manager_id (TEXT) ─────┼──┐                                        │
│  │     created_at (DATETIME)  │  │   Self-referencing for                │
│  │     updated_at (DATETIME)  │◄─┘   manager hierarchy                   │
│  └─────────────────────────────┘                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Database Schema

```sql
-- Employees Table
CREATE TABLE employees (
    id TEXT PRIMARY KEY,
    employee_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    hire_date DATE NOT NULL,
    department TEXT NOT NULL,
    position TEXT NOT NULL,
    employment_status TEXT NOT NULL DEFAULT 'Active'
        CHECK (employment_status IN ('Active', 'Inactive', 'On Leave', 'Terminated')),
    employment_type TEXT NOT NULL DEFAULT 'Full-time'
        CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Intern')),
    manager_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Addresses Table
CREATE TABLE addresses (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    street_address TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    address_type TEXT NOT NULL DEFAULT 'Current'
        CHECK (address_type IN ('Permanent', 'Current', 'Emergency')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(employment_status);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_name ON employees(first_name, last_name);
CREATE INDEX idx_addresses_employee ON addresses(employee_id);
```

---

## 5. API Design

### 5.1 RESTful API Endpoints

#### Employee Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/employees` | List employees (paginated) | - | `{ data: [], total, page, limit }` |
| GET | `/api/employees/:id` | Get single employee | - | `{ data: employee }` |
| POST | `/api/employees` | Create employee | Employee object | `{ data: employee }` |
| PUT | `/api/employees/:id` | Update employee | Employee object | `{ data: employee }` |
| DELETE | `/api/employees/:id` | Delete employee | - | `{ message: "Deleted" }` |
| GET | `/api/employees/search` | Search employees | Query params | `{ data: [], total }` |

#### Address Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/employees/:id/addresses` | Get employee addresses | - | `{ data: [] }` |
| POST | `/api/employees/:id/addresses` | Add address | Address object | `{ data: address }` |
| PUT | `/api/addresses/:id` | Update address | Address object | `{ data: address }` |
| DELETE | `/api/addresses/:id` | Delete address | - | `{ message: "Deleted" }` |

#### Analytics Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/analytics/summary` | Dashboard summary | `{ total, active, newHires, departments }` |
| GET | `/api/analytics/department` | By department | `{ data: [{ name, count }] }` |
| GET | `/api/analytics/status` | By status | `{ data: [{ name, count }] }` |
| GET | `/api/analytics/type` | By employment type | `{ data: [{ name, count }] }` |
| GET | `/api/analytics/location` | By location | `{ data: [{ name, count }] }` |
| GET | `/api/analytics/tenure` | By tenure | `{ data: [{ name, count }] }` |

### 5.2 API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { },
  "message": "Operation successful",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### 5.3 Request/Response Examples

**Create Employee Request:**
```json
POST /api/employees
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@company.com",
  "phone": "+1-555-0123",
  "dateOfBirth": "1990-05-15",
  "hireDate": "2024-01-15",
  "department": "Engineering",
  "position": "Software Developer",
  "employmentStatus": "Active",
  "employmentType": "Full-time",
  "managerId": "emp-uuid-here",
  "addresses": [
    {
      "streetAddress": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94102",
      "country": "USA",
      "addressType": "Current"
    }
  ]
}
```

**Create Employee Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "employeeId": "EMP-000001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@company.com",
    "department": "Engineering",
    "position": "Software Developer",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Employee created successfully"
}
```

---

## 6. Frontend Architecture

### 6.1 Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── SearchBar
│   │   └── UserMenu
│   ├── Sidebar
│   │   └── NavLinks
│   └── MainContent
│       └── [Page Components]
│
├── Pages
│   ├── Dashboard
│   │   ├── SummaryCards
│   │   └── QuickActions
│   │
│   ├── EmployeeListPage
│   │   ├── AdvancedSearch
│   │   ├── EmployeeTable
│   │   └── Pagination
│   │
│   ├── EmployeeProfile
│   │   ├── ProfileHeader
│   │   ├── EmployeeDetails
│   │   ├── AddressList
│   │   └── DirectReports
│   │
│   ├── AddEmployee / EditEmployee
│   │   ├── EmployeeForm
│   │   └── AddressFormSection
│   │
│   └── Analytics
│       ├── SummaryCards
│       ├── DepartmentChart
│       ├── StatusChart
│       ├── TypeChart
│       └── TenureChart
│
└── Common Components
    ├── Button
    ├── Input
    ├── Select
    ├── DatePicker
    ├── Modal
    ├── Table
    ├── Card
    ├── Alert
    └── Loading
```

### 6.2 State Management

Using React Context for global state:

```jsx
// AppContext structure
{
  employees: {
    list: [],
    current: null,
    loading: false,
    error: null
  },
  search: {
    query: '',
    filters: {},
    results: []
  },
  analytics: {
    summary: {},
    charts: {}
  },
  ui: {
    sidebarOpen: true,
    modal: null
  }
}
```

### 6.3 Routing Structure

```jsx
const routes = [
  { path: '/', element: <Dashboard /> },
  { path: '/employees', element: <EmployeeListPage /> },
  { path: '/employees/add', element: <AddEmployee /> },
  { path: '/employees/:id', element: <EmployeeProfile /> },
  { path: '/employees/:id/edit', element: <EditEmployee /> },
  { path: '/analytics', element: <Analytics /> },
  { path: '*', element: <NotFound /> }
];
```

---

## 7. Backend Architecture

### 7.1 Layered Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                ROUTES LAYER                                  │
│   Defines endpoints, connects to controllers                                │
│   employeeRoutes.js, addressRoutes.js, analyticsRoutes.js                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CONTROLLER LAYER                                 │
│   Handles HTTP requests/responses, calls services                           │
│   employeeController.js, addressController.js, analyticsController.js      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER                                   │
│   Business logic, validation, orchestration                                 │
│   employeeService.js, addressService.js, analyticsService.js               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               MODEL LAYER                                    │
│   Data access, SQL queries, database operations                             │
│   employeeModel.js, addressModel.js                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE LAYER                                  │
│   SQLite database with better-sqlite3 driver                               │
│   database.js (connection), schema.sql                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Middleware Pipeline

```
Request → Logger → CORS → JSON Parser → Validator → Route Handler → Error Handler → Response
```

---

## 8. Security Considerations

### 8.1 Input Validation
- Server-side validation using express-validator
- Sanitization of all user inputs
- Parameterized queries to prevent SQL injection

### 8.2 API Security
- CORS configuration for allowed origins
- Rate limiting (future enhancement)
- Request size limits

### 8.3 Data Protection
- Sensitive data excluded from logs
- HTTPS in production (future)

---

## 9. Performance Considerations

### 9.1 Database
- Indexed columns for frequent queries
- Connection pooling (if scaling beyond SQLite)
- Query optimization

### 9.2 Frontend
- Code splitting with React lazy loading
- Memoization for expensive computations
- Debounced search inputs
- Pagination for large lists

### 9.3 Backend
- Response compression (gzip)
- Efficient SQL queries
- Caching headers

---

## 10. Deployment Architecture

### 10.1 Development Environment

```
┌─────────────────┐     ┌─────────────────┐
│   Vite Dev      │     │   Node.js       │
│   Server        │────►│   Express       │
│   (Port 5173)   │     │   (Port 3000)   │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   SQLite DB     │
                        │   (./data.db)   │
                        └─────────────────┘
```

### 10.2 Production Environment (Docker)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Docker Compose                                    │
│  ┌─────────────────────┐    ┌─────────────────────┐                        │
│  │   Frontend          │    │    Backend          │                        │
│  │   Container         │───►│    Container        │                        │
│  │   (nginx:80)        │    │    (node:3000)      │                        │
│  └─────────────────────┘    └──────────┬──────────┘                        │
│                                        │                                    │
│                                        ▼                                    │
│                             ┌─────────────────────┐                        │
│                             │   Volume: data      │                        │
│                             │   (SQLite DB)       │                        │
│                             └─────────────────────┘                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Scalability Path

While the current architecture uses SQLite for simplicity, it's designed to scale:

1. **Database**: SQLite → PostgreSQL (minimal code changes)
2. **Caching**: Add Redis for session/query caching
3. **Search**: Add Elasticsearch for advanced search
4. **Load Balancing**: Stateless backend allows horizontal scaling
5. **CDN**: Static assets can be served via CDN

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-19 | System | Initial version |