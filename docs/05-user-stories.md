# Employee Details Portal - User Stories

## 1. Introduction

This document contains user stories for the Employee Details Portal. Each story follows the standard format:
> **As a** [role], **I want** [feature], **so that** [benefit].

Stories are grouped by Epic and include acceptance criteria, story points, and priority.

---

## 2. Story Point Reference

| Points | Complexity | Effort |
|--------|------------|--------|
| 1 | Trivial | Few hours |
| 2 | Simple | 1 day |
| 3 | Medium | 2-3 days |
| 5 | Complex | 1 week |
| 8 | Very Complex | 1-2 weeks |
| 13 | Epic-level | Needs breakdown |

---

## 3. Epic: Employee Management

### US-001: Add New Employee
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-001 |
| **Title** | Add New Employee |
| **User Story** | As an HR Manager, I want to add new employee records to the system, so that I can maintain an up-to-date employee database. |
| **Priority** | P1 - Must Have |
| **Story Points** | 5 |
| **Sprint** | Sprint 1 |

**Acceptance Criteria**:
- [ ] AC1: Form displays all required fields (first name, last name, email, department, position, hire date)
- [ ] AC2: Form displays optional fields (phone, DOB, address)
- [ ] AC3: Required field validation shows inline error messages
- [ ] AC4: Email format validation is enforced
- [ ] AC5: Unique Employee ID is auto-generated in format EMP-XXXXXX
- [ ] AC6: Manager can be selected from dropdown of existing employees
- [ ] AC7: At least one address must be provided
- [ ] AC8: Success message displays with new Employee ID
- [ ] AC9: After submission, user is redirected to the new employee's profile

**Tasks**:
- [ ] Create employee form component
- [ ] Implement form validation
- [ ] Create API endpoint POST /api/employees
- [ ] Generate unique Employee ID
- [ ] Implement manager selection dropdown
- [ ] Add address sub-form
- [ ] Write unit tests

---

### US-002: View Employee Profile
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-002 |
| **Title** | View Employee Profile |
| **User Story** | As a user, I want to view complete employee details on a profile page, so that I can access all relevant information about an employee. |
| **Priority** | P1 - Must Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 1 |

**Acceptance Criteria**:
- [ ] AC1: Profile page displays all employee basic information
- [ ] AC2: Employment details section shows department, position, status, type
- [ ] AC3: Manager name is displayed with link to their profile
- [ ] AC4: All addresses are listed with type labels
- [ ] AC5: Direct reports section shows list of employees (if applicable)
- [ ] AC6: Edit and Delete buttons visible for authorized users
- [ ] AC7: Page loads within 2 seconds

**Tasks**:
- [ ] Create employee profile component
- [ ] Create API endpoint GET /api/employees/:id
- [ ] Implement manager link navigation
- [ ] Display address list
- [ ] Show direct reports section
- [ ] Add action buttons with role-based visibility

---

### US-003: Edit Employee Details
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-003 |
| **Title** | Edit Employee Details |
| **User Story** | As an HR Manager, I want to edit existing employee information, so that I can keep employee records accurate and current. |
| **Priority** | P1 - Must Have |
| **Story Points** | 5 |
| **Sprint** | Sprint 1 |

**Acceptance Criteria**:
- [ ] AC1: All employee fields are editable in the form
- [ ] AC2: Current values are pre-populated in the form
- [ ] AC3: Validation rules apply same as add form
- [ ] AC4: Cancel button returns to profile without saving
- [ ] AC5: Save button updates the record in database
- [ ] AC6: Success message confirms update
- [ ] AC7: Audit log records the change with timestamp

**Tasks**:
- [ ] Create edit employee form (reuse add form)
- [ ] Create API endpoint PUT /api/employees/:id
- [ ] Implement pre-population of form fields
- [ ] Add cancel functionality
- [ ] Implement audit logging

---

### US-004: Delete Employee Record
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-004 |
| **Title** | Delete Employee Record |
| **User Story** | As an Admin, I want to delete employee records, so that I can remove outdated or incorrect data from the system. |
| **Priority** | P1 - Must Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Delete button available only to Admin users
- [ ] AC2: Confirmation dialog displays before deletion
- [ ] AC3: Dialog shows employee name and ID for verification
- [ ] AC4: If employee has direct reports, prompt for reassignment
- [ ] AC5: Soft delete option marks employee as Terminated
- [ ] AC6: Hard delete removes all associated data
- [ ] AC7: Success message confirms deletion
- [ ] AC8: User redirected to employee list after deletion

**Tasks**:
- [ ] Add delete button to profile page
- [ ] Create confirmation dialog component
- [ ] Implement direct reports reassignment logic
- [ ] Create API endpoint DELETE /api/employees/:id
- [ ] Implement soft delete vs hard delete
- [ ] Add cascade delete for addresses

---

### US-005: List All Employees
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-005 |
| **Title** | List All Employees |
| **User Story** | As a user, I want to see a list of all employees with pagination, so that I can browse through the employee database efficiently. |
| **Priority** | P1 - Must Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 1 |

**Acceptance Criteria**:
- [ ] AC1: Table displays employee ID, name, email, department, position, status
- [ ] AC2: Default page size is 10 records
- [ ] AC3: Pagination controls allow navigation between pages
- [ ] AC4: Total employee count is displayed
- [ ] AC5: Columns are sortable (click header to sort)
- [ ] AC6: Row click navigates to employee profile
- [ ] AC7: Quick action buttons (Edit, View) on each row

**Tasks**:
- [ ] Create employee list component with table
- [ ] Create API endpoint GET /api/employees with pagination
- [ ] Implement pagination controls
- [ ] Add sorting functionality
- [ ] Add row click navigation
- [ ] Add quick action buttons

---

## 4. Epic: Address Management

### US-006: Add Employee Address
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-006 |
| **Title** | Add Employee Address |
| **User Story** | As an HR Manager, I want to add multiple addresses to an employee record, so that I can store different address types (home, office, emergency). |
| **Priority** | P1 - Must Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 1 |

**Acceptance Criteria**:
- [ ] AC1: Address form accessible from employee profile
- [ ] AC2: Required fields: street, city, state, postal code, country, type
- [ ] AC3: Address type dropdown: Permanent, Current, Emergency
- [ ] AC4: Validation for postal code format
- [ ] AC5: Multiple addresses can be added to same employee
- [ ] AC6: New address appears in address list after save

**Tasks**:
- [ ] Create address form component
- [ ] Create API endpoint POST /api/employees/:id/addresses
- [ ] Implement address type selection
- [ ] Add postal code validation
- [ ] Update address list display

---

### US-007: Edit Employee Address
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-007 |
| **Title** | Edit Employee Address |
| **User Story** | As an HR Manager, I want to edit existing addresses, so that I can correct or update address information. |
| **Priority** | P1 - Must Have |
| **Story Points** | 2 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Edit button available on each address card
- [ ] AC2: Form pre-populates with current values
- [ ] AC3: All fields are editable
- [ ] AC4: Save updates the address record
- [ ] AC5: Cancel returns without saving

**Tasks**:
- [ ] Add edit button to address cards
- [ ] Create API endpoint PUT /api/addresses/:id
- [ ] Implement pre-population logic

---

### US-008: Delete Employee Address
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-008 |
| **Title** | Delete Employee Address |
| **User Story** | As an HR Manager, I want to delete an address from an employee record, so that I can remove outdated addresses. |
| **Priority** | P2 - Should Have |
| **Story Points** | 2 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Delete button available on address cards
- [ ] AC2: Confirmation required before deletion
- [ ] AC3: Cannot delete if it's the only address (warning shown)
- [ ] AC4: Address removed from list after deletion

**Tasks**:
- [ ] Add delete button to address cards
- [ ] Create API endpoint DELETE /api/addresses/:id
- [ ] Implement single address protection logic
- [ ] Add confirmation dialog

---

## 5. Epic: Search Functionality

### US-009: Basic Employee Search
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-009 |
| **Title** | Basic Employee Search |
| **User Story** | As a user, I want to search for employees by name or ID, so that I can quickly find specific employees. |
| **Priority** | P1 - Must Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 1 |

**Acceptance Criteria**:
- [ ] AC1: Search bar visible in header/navigation
- [ ] AC2: Search works with partial name match
- [ ] AC3: Search works with employee ID
- [ ] AC4: Results appear as user types (debounced)
- [ ] AC5: Results show name, department, and thumbnail
- [ ] AC6: Clicking result navigates to profile
- [ ] AC7: "No results found" message for empty results

**Tasks**:
- [ ] Create search bar component
- [ ] Create API endpoint GET /api/employees/search
- [ ] Implement debounced search
- [ ] Create search results dropdown
- [ ] Handle empty state

---

### US-010: Advanced Employee Search
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-010 |
| **Title** | Advanced Employee Search |
| **User Story** | As a user, I want to search employees using multiple filters, so that I can find employees matching specific criteria. |
| **Priority** | P1 - Must Have |
| **Story Points** | 5 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Advanced search panel accessible from search bar
- [ ] AC2: Filters available: department, status, type, manager, location
- [ ] AC3: Date range filter for hire date
- [ ] AC4: Multiple filters can be combined (AND logic)
- [ ] AC5: Clear all filters button available
- [ ] AC6: Results displayed in paginated table
- [ ] AC7: Active filters displayed as removable chips

**Tasks**:
- [ ] Create advanced search panel component
- [ ] Create filter components (dropdowns, date pickers)
- [ ] Update search API to handle multiple parameters
- [ ] Implement filter chip display
- [ ] Add clear filters functionality

---

### US-011: Search by Manager
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-011 |
| **Title** | Search by Manager |
| **User Story** | As a manager, I want to find all employees reporting to a specific manager, so that I can view team structures. |
| **Priority** | P2 - Should Have |
| **Story Points** | 2 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Manager filter shows autocomplete dropdown
- [ ] AC2: Selecting manager shows all direct reports
- [ ] AC3: Results include employee name, position, and hire date
- [ ] AC4: Count of direct reports displayed

**Tasks**:
- [ ] Add manager autocomplete to advanced search
- [ ] Implement direct reports query
- [ ] Display count badge

---

## 6. Epic: Analytics Dashboard

### US-012: View Dashboard Summary
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-012 |
| **Title** | View Dashboard Summary |
| **User Story** | As an HR Manager, I want to see summary statistics on the dashboard, so that I can quickly understand workforce metrics. |
| **Priority** | P1 - Must Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Dashboard shows total employee count
- [ ] AC2: Active employees count displayed
- [ ] AC3: New hires this month count displayed
- [ ] AC4: Number of departments displayed
- [ ] AC5: Statistics update in real-time when data changes
- [ ] AC6: Cards are visually distinct with icons

**Tasks**:
- [ ] Create summary card components
- [ ] Create API endpoint GET /api/analytics/summary
- [ ] Implement real-time data fetching
- [ ] Style cards with icons

---

### US-013: Department Distribution Chart
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-013 |
| **Title** | Department Distribution Chart |
| **User Story** | As an HR Manager, I want to see a pie chart of employees by department, so that I can visualize workforce distribution. |
| **Priority** | P1 - Must Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Pie chart displays on analytics dashboard
- [ ] AC2: Each department has distinct color
- [ ] AC3: Legend shows department names and counts
- [ ] AC4: Hover shows percentage and count
- [ ] AC5: Click on segment filters employee list to that department
- [ ] AC6: Chart updates when employee data changes

**Tasks**:
- [ ] Install charting library (Recharts)
- [ ] Create pie chart component
- [ ] Create API endpoint GET /api/analytics/department
- [ ] Implement click-to-filter functionality
- [ ] Add legend and tooltips

---

### US-014: Employment Type Distribution Chart
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-014 |
| **Title** | Employment Type Distribution Chart |
| **User Story** | As an HR Manager, I want to see a pie chart of employees by employment type, so that I can understand the workforce composition. |
| **Priority** | P1 - Must Have |
| **Story Points** | 2 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Pie chart shows Full-time, Part-time, Contract, Intern
- [ ] AC2: Each type has distinct color
- [ ] AC3: Hover displays count and percentage
- [ ] AC4: Legend visible below chart

**Tasks**:
- [ ] Create employment type pie chart
- [ ] Create API endpoint GET /api/analytics/type
- [ ] Configure colors for each type

---

### US-015: Employment Status Distribution Chart
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-015 |
| **Title** | Employment Status Distribution Chart |
| **User Story** | As an HR Manager, I want to see a pie chart of employees by status, so that I can monitor active vs inactive workforce. |
| **Priority** | P1 - Must Have |
| **Story Points** | 2 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Pie chart shows Active, Inactive, On Leave, Terminated
- [ ] AC2: Status colors follow convention (green for active, etc.)
- [ ] AC3: Hover displays count and percentage
- [ ] AC4: Legend visible

**Tasks**:
- [ ] Create status pie chart
- [ ] Create API endpoint GET /api/analytics/status
- [ ] Define status color scheme

---

### US-016: Location Distribution Chart
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-016 |
| **Title** | Location Distribution Chart |
| **User Story** | As an HR Manager, I want to see a pie chart of employees by location, so that I can understand geographic distribution. |
| **Priority** | P2 - Should Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 3 |

**Acceptance Criteria**:
- [ ] AC1: Pie chart shows distribution by city/state/country
- [ ] AC2: Toggle to switch between grouping levels
- [ ] AC3: Shows top 5 locations + "Others" category
- [ ] AC4: Hover shows location details

**Tasks**:
- [ ] Create location pie chart
- [ ] Create API endpoint GET /api/analytics/location
- [ ] Implement grouping level toggle
- [ ] Handle "Others" aggregation

---

### US-017: Tenure Distribution Chart
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-017 |
| **Title** | Tenure Distribution Chart |
| **User Story** | As an HR Manager, I want to see a pie chart of employees by tenure, so that I can analyze workforce experience levels. |
| **Priority** | P2 - Should Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 3 |

**Acceptance Criteria**:
- [ ] AC1: Pie chart shows tenure brackets: <1yr, 1-3yr, 3-5yr, 5+yr
- [ ] AC2: Calculation based on hire date and current date
- [ ] AC3: Hover shows count and percentage for each bracket
- [ ] AC4: Legend visible

**Tasks**:
- [ ] Create tenure pie chart
- [ ] Create API endpoint GET /api/analytics/tenure
- [ ] Implement tenure calculation logic

---

## 7. Epic: Manager Hierarchy

### US-018: View Direct Reports
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-018 |
| **Title** | View Direct Reports |
| **User Story** | As a manager, I want to see a list of my direct reports on an employee's profile, so that I can understand reporting relationships. |
| **Priority** | P2 - Should Have |
| **Story Points** | 2 |
| **Sprint** | Sprint 2 |

**Acceptance Criteria**:
- [ ] AC1: Direct reports section visible on profile if employee has reports
- [ ] AC2: List shows name, position, and email of each report
- [ ] AC3: Click on name navigates to that employee's profile
- [ ] AC4: Count of direct reports displayed in section header

**Tasks**:
- [ ] Create direct reports component
- [ ] Add query to fetch direct reports
- [ ] Style the direct reports list

---

### US-019: Assign Manager
| Attribute | Value |
|-----------|-------|
| **Story ID** | US-019 |
| **Title** | Assign Manager |
| **User Story** | As an HR Manager, I want to assign or change an employee's manager, so that I can maintain accurate reporting structure. |
| **Priority** | P1 - Must Have |
| **Story Points** | 3 |
| **Sprint** | Sprint 1 |

**Acceptance Criteria**:
- [ ] AC1: Manager field available in add/edit employee form
- [ ] AC2: Dropdown shows searchable list of employees
- [ ] AC3: Cannot select self as manager
- [ ] AC4: Cannot create circular reference (A→B→A)
- [ ] AC5: Manager change is logged in audit trail

**Tasks**:
- [ ] Add manager dropdown to employee form
- [ ] Implement self-reference validation
- [ ] Implement circular reference detection
- [ ] Log manager changes

---

## 8. User Story Summary

| Story ID | Title | Points | Priority | Sprint |
|----------|-------|--------|----------|--------|
| US-001 | Add New Employee | 5 | P1 | Sprint 1 |
| US-002 | View Employee Profile | 3 | P1 | Sprint 1 |
| US-003 | Edit Employee Details | 5 | P1 | Sprint 1 |
| US-004 | Delete Employee Record | 3 | P1 | Sprint 2 |
| US-005 | List All Employees | 3 | P1 | Sprint 1 |
| US-006 | Add Employee Address | 3 | P1 | Sprint 1 |
| US-007 | Edit Employee Address | 2 | P1 | Sprint 2 |
| US-008 | Delete Employee Address | 2 | P2 | Sprint 2 |
| US-009 | Basic Employee Search | 3 | P1 | Sprint 1 |
| US-010 | Advanced Employee Search | 5 | P1 | Sprint 2 |
| US-011 | Search by Manager | 2 | P2 | Sprint 2 |
| US-012 | View Dashboard Summary | 3 | P1 | Sprint 2 |
| US-013 | Department Distribution Chart | 3 | P1 | Sprint 2 |
| US-014 | Employment Type Chart | 2 | P1 | Sprint 2 |
| US-015 | Employment Status Chart | 2 | P1 | Sprint 2 |
| US-016 | Location Distribution Chart | 3 | P2 | Sprint 3 |
| US-017 | Tenure Distribution Chart | 3 | P2 | Sprint 3 |
| US-018 | View Direct Reports | 2 | P2 | Sprint 2 |
| US-019 | Assign Manager | 3 | P1 | Sprint 1 |

**Total Story Points**: 57

### Sprint Allocation

| Sprint | Stories | Total Points |
|--------|---------|--------------|
| Sprint 1 | US-001, US-002, US-003, US-005, US-006, US-009, US-019 | 25 |
| Sprint 2 | US-004, US-007, US-008, US-010, US-011, US-012, US-013, US-014, US-015, US-018 | 26 |
| Sprint 3 | US-016, US-017 | 6 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-19 | System | Initial version |