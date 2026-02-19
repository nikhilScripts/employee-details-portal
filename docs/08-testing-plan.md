# Employee Details Portal - Testing Plan

## 1. Introduction

This document outlines the comprehensive testing strategy for the Employee Details Portal. It covers all testing phases, types, tools, and acceptance criteria to ensure the application meets quality standards.

---

## 2. Testing Objectives

| Objective | Description |
|-----------|-------------|
| **Quality Assurance** | Ensure the application functions correctly and meets requirements |
| **Code Coverage** | Achieve >80% code coverage for both frontend and backend |
| **Regression Prevention** | Automated tests prevent introduction of new bugs |
| **Performance Validation** | Verify response times meet NFR specifications |
| **Security Verification** | Validate input handling and data protection |

---

## 3. Testing Scope

### 3.1 In Scope

| Area | Components |
|------|------------|
| Backend API | All REST endpoints, services, models |
| Frontend | React components, pages, hooks, services |
| Database | Schema validation, data integrity, migrations |
| Integration | API-Database, Frontend-API communication |
| User Interface | Component rendering, user interactions |

### 3.2 Out of Scope

- Load/stress testing (deferred to later phase)
- Penetration testing (requires specialized tools)
- Cross-browser automated testing
- Mobile app testing (web responsive only)

---

## 4. Testing Types and Levels

### 4.1 Testing Pyramid

```
                    ┌─────────────┐
                    │    E2E      │  ← Few, slow, expensive
                    │   Tests     │
                   ─┼─────────────┼─
                  / │ Integration │ \
                 /  │   Tests     │  \
               ─┼───┴─────────────┴───┼─
              / │                     │ \
             /  │    Unit Tests       │  \  ← Many, fast, cheap
            ────┴─────────────────────┴────
```

### 4.2 Test Distribution

| Type | Coverage Target | Estimated Count |
|------|-----------------|-----------------|
| Unit Tests | 80%+ | ~150 tests |
| Integration Tests | All API endpoints | ~50 tests |
| Component Tests | All React components | ~40 tests |
| E2E Tests | Critical user flows | ~10 tests |

---

## 5. Unit Testing

### 5.1 Backend Unit Tests

#### Scope
- Service layer functions
- Utility functions
- Validation logic
- ID generation
- Data transformations

#### Framework
- **Jest** - Test runner and assertion library

#### Directory Structure
```
backend/
└── tests/
    └── unit/
        ├── services/
        │   ├── employeeService.test.js
        │   ├── addressService.test.js
        │   └── analyticsService.test.js
        ├── utils/
        │   ├── idGenerator.test.js
        │   ├── validators.test.js
        │   └── responseHelper.test.js
        └── models/
            ├── employeeModel.test.js
            └── addressModel.test.js
```

#### Test Cases - Employee Service

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| UT-ES-001 | Generate employee ID with next sequence | Returns EMP-XXXXXX format |
| UT-ES-002 | Generate ID when no employees exist | Returns EMP-000001 |
| UT-ES-003 | Validate required fields present | Returns true for valid data |
| UT-ES-004 | Validate email format | Returns false for invalid email |
| UT-ES-005 | Detect circular manager reference | Throws error for A→B→A |
| UT-ES-006 | Prevent self as manager | Throws error for self-reference |
| UT-ES-007 | Calculate tenure from hire date | Returns correct bracket |
| UT-ES-008 | Transform database row to API format | Correct camelCase conversion |

#### Sample Test Code

```javascript
// tests/unit/services/employeeService.test.js
const employeeService = require('../../../src/services/employeeService');

describe('Employee Service', () => {
  describe('generateEmployeeId', () => {
    it('should generate ID in EMP-XXXXXX format', () => {
      const id = employeeService.generateEmployeeId(1);
      expect(id).toMatch(/^EMP-\d{6}$/);
    });

    it('should pad single digit to 6 digits', () => {
      expect(employeeService.generateEmployeeId(1)).toBe('EMP-000001');
    });

    it('should handle large numbers', () => {
      expect(employeeService.generateEmployeeId(999999)).toBe('EMP-999999');
    });
  });

  describe('validateEmployeeData', () => {
    const validEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      department: 'Engineering',
      hireDate: '2024-01-15'
    };

    it('should pass for valid data', () => {
      const result = employeeService.validateEmployeeData(validEmployee);
      expect(result.valid).toBe(true);
    });

    it('should fail for missing firstName', () => {
      const data = { ...validEmployee, firstName: '' };
      const result = employeeService.validateEmployeeData(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'firstName' })
      );
    });

    it('should fail for invalid email', () => {
      const data = { ...validEmployee, email: 'invalid' };
      const result = employeeService.validateEmployeeData(data);
      expect(result.valid).toBe(false);
    });
  });

  describe('detectCircularReference', () => {
    const employees = [
      { id: '1', managerId: '2' },
      { id: '2', managerId: '3' },
      { id: '3', managerId: null }
    ];

    it('should return false for valid hierarchy', () => {
      const result = employeeService.detectCircularReference('1', '3', employees);
      expect(result).toBe(false);
    });

    it('should return true for circular reference', () => {
      const circular = [...employees];
      circular[2].managerId = '1'; // 3 → 1 creates loop
      const result = employeeService.detectCircularReference('1', '3', circular);
      expect(result).toBe(true);
    });
  });
});
```

### 5.2 Frontend Unit Tests

#### Scope
- Utility functions
- Custom hooks
- Context reducers
- Service transformations

#### Framework
- **Jest** - Test runner
- **React Testing Library** - Component testing

#### Test Cases - Utilities

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| UT-FE-001 | Format date to locale string | Returns formatted date |
| UT-FE-002 | Format phone number | Returns formatted phone |
| UT-FE-003 | Validate email client-side | Returns boolean |
| UT-FE-004 | Calculate tenure text | Returns "X years, Y months" |
| UT-FE-005 | Transform API response to state | Correct structure |

---

## 6. Integration Testing

### 6.1 API Integration Tests

#### Framework
- **Jest** + **Supertest**

#### Test Environment
- In-memory SQLite database
- Fresh database for each test suite
- Seed data loaded before tests

#### Directory Structure
```
backend/
└── tests/
    └── integration/
        └── api/
            ├── employees.test.js
            ├── addresses.test.js
            ├── analytics.test.js
            └── search.test.js
```

#### Test Cases - Employee API

| Test ID | Endpoint | Method | Test Case | Expected |
|---------|----------|--------|-----------|----------|
| IT-API-001 | /api/employees | GET | List employees | 200, array |
| IT-API-002 | /api/employees | GET | Pagination works | Correct page size |
| IT-API-003 | /api/employees | GET | Sort by name | Sorted results |
| IT-API-004 | /api/employees | POST | Create with valid data | 201, employee object |
| IT-API-005 | /api/employees | POST | Missing required field | 400, validation error |
| IT-API-006 | /api/employees | POST | Duplicate email | 409, conflict error |
| IT-API-007 | /api/employees/:id | GET | Get existing employee | 200, employee data |
| IT-API-008 | /api/employees/:id | GET | Get non-existent | 404, not found |
| IT-API-009 | /api/employees/:id | PUT | Update existing | 200, updated data |
| IT-API-010 | /api/employees/:id | PUT | Update with invalid data | 400, validation error |
| IT-API-011 | /api/employees/:id | DELETE | Delete existing | 200, success message |
| IT-API-012 | /api/employees/:id | DELETE | Delete non-existent | 404, not found |
| IT-API-013 | /api/employees/:id | DELETE | Cascade delete addresses | Addresses deleted |

#### Sample Integration Test

```javascript
// tests/integration/api/employees.test.js
const request = require('supertest');
const app = require('../../../src/app');
const { initTestDb, closeTestDb, seedTestData } = require('../../helpers/testDb');

describe('Employee API', () => {
  beforeAll(async () => {
    await initTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  beforeEach(async () => {
    await seedTestData();
  });

  describe('GET /api/employees', () => {
    it('should return paginated list of employees', async () => {
      const res = await request(app)
        .get('/api/employees')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.total).toBeGreaterThan(0);
      expect(res.body.data.length).toBeLessThanOrEqual(10);
    });

    it('should return sorted results when sort param provided', async () => {
      const res = await request(app)
        .get('/api/employees')
        .query({ sort: 'firstName', order: 'asc' })
        .expect(200);

      const names = res.body.data.map(e => e.firstName);
      expect(names).toEqual([...names].sort());
    });
  });

  describe('POST /api/employees', () => {
    const validEmployee = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com',
      department: 'Engineering',
      position: 'Developer',
      hireDate: '2024-01-15',
      employmentStatus: 'Active',
      employmentType: 'Full-time',
      addresses: [{
        streetAddress: '123 Test St',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'USA',
        addressType: 'Current'
      }]
    };

    it('should create employee with valid data', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send(validEmployee)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.employeeId).toMatch(/^EMP-\d{6}$/);
      expect(res.body.data.firstName).toBe('Test');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = { firstName: 'Test' };
      
      const res = await request(app)
        .post('/api/employees')
        .send(invalidData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate email', async () => {
      // First create
      await request(app).post('/api/employees').send(validEmployee);
      
      // Duplicate
      const res = await request(app)
        .post('/api/employees')
        .send(validEmployee)
        .expect(409);

      expect(res.body.error.code).toBe('DUPLICATE_EMAIL');
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete employee and cascade to addresses', async () => {
      // Create employee with address
      const createRes = await request(app)
        .post('/api/employees')
        .send(validEmployee);
      
      const employeeId = createRes.body.data.id;

      // Delete
      await request(app)
        .delete(`/api/employees/${employeeId}`)
        .expect(200);

      // Verify deleted
      await request(app)
        .get(`/api/employees/${employeeId}`)
        .expect(404);

      // Verify addresses deleted
      const addressRes = await request(app)
        .get(`/api/employees/${employeeId}/addresses`);
      
      expect(addressRes.body.data).toHaveLength(0);
    });
  });
});
```

---

## 7. Component Testing

### 7.1 React Component Tests

#### Framework
- **Jest** + **React Testing Library**
- **MSW** (Mock Service Worker) for API mocking

#### Test Categories

| Category | Components | Focus Areas |
|----------|------------|-------------|
| Common | Button, Input, Modal, Table | Props, events, accessibility |
| Employee | EmployeeForm, EmployeeCard, EmployeeList | Rendering, validation, submission |
| Search | SearchBar, AdvancedSearch | Input handling, filter state |
| Charts | PieChart, SummaryCard | Data rendering, interactivity |
| Pages | Dashboard, EmployeeProfile | Data loading, routing |

#### Test Cases - EmployeeForm Component

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| CT-EF-001 | Render empty form | All fields empty |
| CT-EF-002 | Render with initial data | Fields pre-populated |
| CT-EF-003 | Show validation errors | Error messages displayed |
| CT-EF-004 | Submit with valid data | onSubmit called with data |
| CT-EF-005 | Cancel button works | onCancel called |
| CT-EF-006 | Required fields marked | Asterisk or indicator shown |
| CT-EF-007 | Manager dropdown populated | Options from API |

#### Sample Component Test

```jsx
// tests/components/employee/EmployeeForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeForm } from '../../../src/components/employee/EmployeeForm';

// Mock API
jest.mock('../../../src/services/employeeService', () => ({
  getManagers: jest.fn(() => Promise.resolve([
    { id: '1', firstName: 'Jane', lastName: 'Doe' }
  ]))
}));

describe('EmployeeForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders all required fields', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hire date/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Smith');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.selectOptions(screen.getByLabelText(/department/i), 'Engineering');
    await user.type(screen.getByLabelText(/hire date/i), '2024-01-15');

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com'
        })
      );
    });
  });

  it('pre-populates fields when initialData provided', () => {
    const initialData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      department: 'Sales'
    };

    render(
      <EmployeeForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
        initialData={initialData}
      />
    );

    expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
  });

  it('calls onCancel when cancel button clicked', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
```

---

## 8. End-to-End Testing

### 8.1 E2E Test Framework
- **Playwright** or **Cypress** (to be decided based on spike)

### 8.2 Critical User Flows

| Test ID | User Flow | Steps | Expected Outcome |
|---------|-----------|-------|------------------|
| E2E-001 | Add New Employee | 1. Navigate to Add<br>2. Fill form<br>3. Submit | Employee created, profile shown |
| E2E-002 | Search Employee | 1. Type in search<br>2. Select result | Profile page displayed |
| E2E-003 | Edit Employee | 1. Open profile<br>2. Click Edit<br>3. Modify<br>4. Save | Changes saved |
| E2E-004 | Delete Employee | 1. Open profile<br>2. Delete<br>3. Confirm | Employee removed |
| E2E-005 | View Analytics | 1. Navigate to Analytics<br>2. View charts | Charts displayed correctly |
| E2E-006 | Advanced Search | 1. Open advanced search<br>2. Apply filters | Filtered results shown |

---

## 9. Test Data Management

### 9.1 Test Data Strategy

| Environment | Data Source | Reset Frequency |
|-------------|-------------|-----------------|
| Unit Tests | Mock objects | Per test |
| Integration Tests | In-memory SQLite | Per test suite |
| Component Tests | Mock API (MSW) | Per test |
| E2E Tests | Dedicated test DB | Per test suite |

### 9.2 Sample Test Data

```javascript
// tests/fixtures/employees.js
const testEmployees = [
  {
    id: 'test-emp-001',
    employeeId: 'EMP-000001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@test.com',
    department: 'Engineering',
    position: 'Senior Developer',
    employmentStatus: 'Active',
    employmentType: 'Full-time',
    hireDate: '2022-01-15',
    managerId: null
  },
  {
    id: 'test-emp-002',
    employeeId: 'EMP-000002',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@test.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    employmentStatus: 'Active',
    employmentType: 'Full-time',
    hireDate: '2021-06-01',
    managerId: null
  },
  {
    id: 'test-emp-003',
    employeeId: 'EMP-000003',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@test.com',
    department: 'Engineering',
    position: 'Junior Developer',
    employmentStatus: 'Active',
    employmentType: 'Full-time',
    hireDate: '2023-03-20',
    managerId: 'test-emp-001'
  }
];

const testAddresses = [
  {
    id: 'test-addr-001',
    employeeId: 'test-emp-001',
    streetAddress: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'USA',
    addressType: 'Current'
  }
];

module.exports = { testEmployees, testAddresses };
```

---

## 10. Test Automation

### 10.1 CI/CD Pipeline Tests

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
```

### 10.2 Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test -- --onlyChanged"
    }
  }
}
```

---

## 11. Test Execution Schedule

| Phase | Tests | Trigger | Duration |
|-------|-------|---------|----------|
| Pre-commit | Unit tests (changed files) | Git commit | ~30s |
| PR Build | All unit + integration tests | Pull request | ~5min |
| Nightly | Full test suite + E2E | Scheduled | ~15min |
| Pre-release | Full suite + manual testing | Release | ~2hr |

---

## 12. Acceptance Criteria

### 12.1 Quality Gates

| Metric | Threshold | Action if Failed |
|--------|-----------|------------------|
| Unit Test Pass Rate | 100% | Block merge |
| Integration Test Pass Rate | 100% | Block merge |
| Code Coverage | >80% | Block merge |
| Component Test Pass Rate | 100% | Block merge |
| E2E Test Pass Rate | >95% | Review required |

### 12.2 Coverage Requirements

| Area | Minimum Coverage |
|------|------------------|
| Backend Services | 85% |
| Backend Models | 80% |
| Backend Utils | 90% |
| Frontend Components | 75% |
| Frontend Hooks | 80% |
| Frontend Utils | 90% |

---

## 13. Test Reporting

### 13.1 Report Types

| Report | Tool | Frequency |
|--------|------|-----------|
| Coverage Report | Jest + Istanbul | Per run |
| Test Results | Jest JSON reporter | Per run |
| Trend Analysis | CI dashboard | Weekly |

### 13.2 Sample Coverage Report

```
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files              |   85.2  |   80.1   |   88.5  |   84.9  |
 services/             |   90.5  |   85.2   |   92.0  |   90.1  |
  employeeService.js   |   95.0  |   90.0   |   95.0  |   95.0  |
  addressService.js    |   88.0  |   82.0   |   90.0  |   87.0  |
 models/               |   82.0  |   78.0   |   85.0  |   81.0  |
  employeeModel.js     |   85.0  |   80.0   |   88.0  |   84.0  |
-----------------------|---------|----------|---------|---------|
```

---

## 14. Defect Management

### 14.1 Defect Severity

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | App crash, data loss | Immediate |
| High | Feature broken, no workaround | 24 hours |
| Medium | Feature impaired, workaround exists | 3 days |
| Low | Minor issue, cosmetic | Next sprint |

### 14.2 Bug Report Template

```markdown
## Bug Report

**Title**: [Brief description]

**Severity**: [Critical/High/Medium/Low]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**: 

**Actual Result**: 

**Environment**:
- Browser: 
- OS: 
- Version: 

**Screenshots/Logs**: [Attach if applicable]
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-19 | System | Initial version |