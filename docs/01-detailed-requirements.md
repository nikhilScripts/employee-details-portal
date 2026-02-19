# Employee Details Portal - Detailed Requirements

## 1. Project Overview

The Employee Details Portal is a web-based application designed to manage employee information within an organization. The system provides comprehensive employee management capabilities including profile management, organizational hierarchy visualization, and analytics through interactive dashboards.

## 2. Business Objectives

- Centralize employee data management
- Streamline HR operations for employee information retrieval
- Provide quick access to employee profiles and organizational structure
- Enable data-driven insights through visual analytics
- Reduce manual effort in employee data management

## 3. Scope

### 3.1 In Scope
- Employee profile management (CRUD operations)
- Employee search functionality with multiple parameters
- Visual analytics (pie charts) for employee data
- Manager-employee relationship tracking
- Address management for employees
- Employee ID generation and tracking

### 3.2 Out of Scope
- Payroll management
- Leave management
- Performance reviews
- Attendance tracking
- Document management
- Integration with external HR systems (Phase 1)

## 4. Employee Data Model

### 4.1 Core Employee Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Employee ID | String | Yes | Unique identifier (auto-generated) |
| First Name | String | Yes | Employee's first name |
| Last Name | String | Yes | Employee's last name |
| Email | String | Yes | Corporate email address |
| Phone | String | No | Contact number |
| Date of Birth | Date | No | Employee's date of birth |
| Hire Date | Date | Yes | Date of joining |
| Department | String | Yes | Department name |
| Position/Title | String | Yes | Job title |
| Manager ID | String | No | Reference to manager's employee ID |
| Employment Status | Enum | Yes | Active, Inactive, On Leave, Terminated |
| Employment Type | Enum | Yes | Full-time, Part-time, Contract, Intern |

### 4.2 Address Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Address ID | String | Yes | Unique identifier |
| Street Address | String | Yes | Street address line 1 |
| Address Line 2 | String | No | Apartment, suite, etc. |
| City | String | Yes | City name |
| State | String | Yes | State/Province |
| Postal Code | String | Yes | ZIP/Postal code |
| Country | String | Yes | Country name |
| Address Type | Enum | Yes | Permanent, Current, Emergency |

## 5. Feature Requirements

### 5.1 Employee Management

#### 5.1.1 Add Employee
- Form to capture all employee details
- Validation for required fields
- Auto-generation of Employee ID
- Manager selection from existing employees
- Multiple address support

#### 5.1.2 View Employee
- Display complete employee profile
- Show manager information with link
- Display all associated addresses
- Show direct reports (if any)

#### 5.1.3 Edit Employee
- Update any employee field
- Add/remove/modify addresses
- Change manager assignment
- Update employment status

#### 5.1.4 Delete Employee
- Soft delete (mark as inactive) or hard delete
- Confirmation dialog
- Handle cascade effects (direct reports reassignment)

### 5.2 Search Functionality

#### Search Parameters
- Employee ID
- Name (First/Last/Full)
- Email
- Department
- Position/Title
- Manager Name
- Employment Status
- Employment Type
- Hire Date Range
- City/State/Country

#### Search Features
- Multi-parameter search
- Partial matching support
- Search results pagination
- Export search results

### 5.3 Analytics Dashboard

#### Pie Charts
1. **Employees by Department** - Distribution across departments
2. **Employees by Employment Type** - Full-time vs Part-time vs Contract
3. **Employees by Employment Status** - Active vs Inactive vs On Leave
4. **Employees by Location** - Distribution by city/country
5. **Employees by Tenure** - <1 year, 1-3 years, 3-5 years, 5+ years

#### Dashboard Features
- Interactive charts with drill-down
- Filter by date range
- Export charts as images
- Real-time data updates

## 6. User Roles

### 6.1 Admin
- Full CRUD access to all employees
- Access to all analytics
- System configuration access

### 6.2 HR Manager
- CRUD access to all employees
- Access to all analytics

### 6.3 Manager
- View access to all employees
- Edit access to direct reports only
- Limited analytics access

### 6.4 Employee
- View own profile only
- Edit limited fields (phone, address)

## 7. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Backend | Node.js with Express |
| Database | SQLite |
| State Management | React Context/Redux |
| Charting | Chart.js or Recharts |
| Styling | CSS/Tailwind CSS |
| Testing | Jest, React Testing Library |

## 8. Integration Points

- REST API for all operations
- JSON data format
- Authentication tokens (future phase)

## 9. Constraints

- SQLite for local development (can scale to PostgreSQL)
- Single-tenant application
- English language only (Phase 1)

## 10. Assumptions

- Users have modern web browsers
- Stable network connectivity
- Single timezone operation (configurable)