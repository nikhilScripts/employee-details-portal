# Employee Details Portal - User Journeys

## 1. Introduction

This document describes the key user journeys for the Employee Details Portal. Each journey maps out the end-to-end experience of users accomplishing specific goals within the system.

---

## 2. User Personas

### 2.1 HR Manager - Sarah
- **Role**: HR Manager
- **Goals**: Manage employee records, generate reports, analyze workforce data
- **Tech Proficiency**: Moderate
- **Frequency of Use**: Daily

### 2.2 Department Manager - Mike
- **Role**: Engineering Manager
- **Goals**: View team details, find employee contacts, review team structure
- **Tech Proficiency**: High
- **Frequency of Use**: Weekly

### 2.3 Employee - Alice
- **Role**: Software Developer
- **Goals**: View and update personal information, find colleagues
- **Tech Proficiency**: High
- **Frequency of Use**: Monthly

### 2.4 System Administrator - John
- **Role**: IT Administrator
- **Goals**: System maintenance, user management, data integrity
- **Tech Proficiency**: Expert
- **Frequency of Use**: As needed

---

## 3. User Journey Maps

### Journey 1: Add New Employee (HR Manager)

**Persona**: Sarah (HR Manager)
**Goal**: Register a new employee in the system
**Trigger**: New hire joins the organization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ADD NEW EMPLOYEE JOURNEY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  START ──► Dashboard ──► Employee List ──► "Add Employee" ──► Form          │
│                                                                              │
│           ┌──────────────────────────────────────────────────────────┐      │
│           │  EMPLOYEE FORM                                            │      │
│           │  ┌─────────────────────────────────────────────────────┐ │      │
│           │  │ Basic Info: Name, Email, Phone, DOB                 │ │      │
│           │  │ Employment: Department, Position, Type, Hire Date   │ │      │
│           │  │ Manager: Select from dropdown                       │ │      │
│           │  │ Address: Street, City, State, Postal, Country      │ │      │
│           │  └─────────────────────────────────────────────────────┘ │      │
│           │                    [Submit]                               │      │
│           └──────────────────────────────────────────────────────────┘      │
│                                        │                                     │
│                                        ▼                                     │
│                              ┌─────────────────┐                            │
│                              │  Validation     │                            │
│                              └────────┬────────┘                            │
│                                       │                                      │
│                          ┌────────────┴────────────┐                        │
│                          ▼                         ▼                        │
│                    [Success]                  [Errors]                      │
│                         │                          │                        │
│                         ▼                          ▼                        │
│            "Employee EMP-001234          Show inline errors                 │
│             created successfully"         Fix and resubmit                  │
│                         │                                                   │
│                         ▼                                                   │
│              View New Employee Profile ──► END                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Steps**:
| Step | Action | System Response | Emotion |
|------|--------|-----------------|---------|
| 1 | Sarah logs into the portal | Dashboard displayed | Neutral |
| 2 | Clicks "Employees" in navigation | Employee list page loads | Neutral |
| 3 | Clicks "Add Employee" button | Add employee form opens | Focused |
| 4 | Fills in basic information | Real-time validation feedback | Engaged |
| 5 | Selects department and position | Auto-populates related fields | Satisfied |
| 6 | Searches and selects manager | Manager name displayed | Confident |
| 7 | Enters address details | Address validated | Neutral |
| 8 | Clicks "Submit" | Processing indicator shown | Anticipating |
| 9 | Receives success message | New employee profile shown | Happy |

**Pain Points**:
- Multiple fields to fill manually
- Finding correct manager from large list

**Opportunities**:
- Auto-fill based on department selection
- Recently used managers shown first
- Save draft functionality

---

### Journey 2: Search for Employee (All Users)

**Persona**: Mike (Department Manager)
**Goal**: Find an employee's contact information
**Trigger**: Need to contact a colleague from another team

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SEARCH EMPLOYEE JOURNEY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  START ──► Dashboard ──► Search Bar ──► Type query                          │
│                              │                                               │
│                              ▼                                               │
│            ┌────────────────────────────────────┐                           │
│            │  Search Results (live)             │                           │
│            │  ┌──────────────────────────────┐  │                           │
│            │  │ 👤 John Smith - Engineering  │  │                           │
│            │  │ 👤 Jane Smith - Marketing    │  │                           │
│            │  │ 👤 Johnson Lee - Sales       │  │                           │
│            │  └──────────────────────────────┘  │                           │
│            └────────────────────────────────────┘                           │
│                              │                                               │
│                              ▼                                               │
│            Click desired result                                              │
│                              │                                               │
│                              ▼                                               │
│            ┌────────────────────────────────────┐                           │
│            │  Employee Profile                  │                           │
│            │  ┌──────────────────────────────┐  │                           │
│            │  │ Name: John Smith             │  │                           │
│            │  │ Email: john.smith@company    │  │                           │
│            │  │ Phone: +1-555-0123           │  │                           │
│            │  │ Department: Engineering      │  │                           │
│            │  │ Manager: Jane Doe            │  │                           │
│            │  └──────────────────────────────┘  │                           │
│            └────────────────────────────────────┘                           │
│                              │                                               │
│                              ▼                                               │
│                             END                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Steps**:
| Step | Action | System Response | Emotion |
|------|--------|-----------------|---------|
| 1 | Mike opens the portal | Dashboard loads | Neutral |
| 2 | Clicks on search bar | Search bar focused | Engaged |
| 3 | Types partial name "Smi" | Live results appear | Hopeful |
| 4 | Reviews matching results | Results clearly displayed | Focused |
| 5 | Clicks on "John Smith" | Profile page opens | Satisfied |
| 6 | Copies email/phone | Contact info available | Happy |

**Alternative Flow - Advanced Search**:
| Step | Action | System Response | Emotion |
|------|--------|-----------------|---------|
| 3a | Clicks "Advanced Search" | Filter panel opens | Curious |
| 3b | Selects department filter | List filtered | Focused |
| 3c | Applies date range | Results refined | Satisfied |

---

### Journey 3: View Analytics Dashboard (HR Manager)

**Persona**: Sarah (HR Manager)
**Goal**: Analyze workforce distribution for quarterly report
**Trigger**: Monthly management meeting preparation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     VIEW ANALYTICS DASHBOARD JOURNEY                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  START ──► Dashboard ──► "Analytics" Nav                                    │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ANALYTICS DASHBOARD                               │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   Total     │ │   Active    │ │  New Hires  │ │ Departments │   │   │
│  │  │    250      │ │    235      │ │     12      │ │      8      │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐                │   │
│  │  │  By Department       │  │  By Employment Type  │                │   │
│  │  │      [PIE CHART]     │  │     [PIE CHART]      │                │   │
│  │  │  Engineering: 40%    │  │  Full-time: 75%      │                │   │
│  │  │  Sales: 25%          │  │  Part-time: 15%      │                │   │
│  │  │  Marketing: 20%      │  │  Contract: 10%       │                │   │
│  │  │  Others: 15%         │  │                      │                │   │
│  │  └──────────────────────┘  └──────────────────────┘                │   │
│  │                                                                      │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐                │   │
│  │  │  By Status           │  │  By Tenure           │                │   │
│  │  │     [PIE CHART]      │  │     [PIE CHART]      │                │   │
│  │  └──────────────────────┘  └──────────────────────┘                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│                              ▼                                               │
│            Click on chart segment for drill-down                            │
│                              │                                               │
│                              ▼                                               │
│            View detailed employee list for that segment                     │
│                              │                                               │
│                              ▼                                               │
│                             END                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Steps**:
| Step | Action | System Response | Emotion |
|------|--------|-----------------|---------|
| 1 | Sarah navigates to Analytics | Dashboard loads with charts | Curious |
| 2 | Views summary statistics | Key metrics visible | Informed |
| 3 | Examines department pie chart | Interactive chart displayed | Engaged |
| 4 | Hovers over Engineering segment | Tooltip shows count/percentage | Satisfied |
| 5 | Clicks on Engineering segment | Drills down to employee list | Focused |
| 6 | Reviews Engineering team list | List with details shown | Informed |
| 7 | Exports data for report | Download initiated | Accomplished |

---

### Journey 4: Update Own Profile (Employee)

**Persona**: Alice (Software Developer)
**Goal**: Update contact phone number after getting new number
**Trigger**: Personal phone number change

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      UPDATE OWN PROFILE JOURNEY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  START ──► Dashboard ──► "My Profile"                                       │
│                              │                                               │
│                              ▼                                               │
│            ┌────────────────────────────────────┐                           │
│            │  MY PROFILE (View Mode)            │                           │
│            │  ┌──────────────────────────────┐  │                           │
│            │  │ Name: Alice Johnson          │  │                           │
│            │  │ Email: alice.j@company.com   │  │                           │
│            │  │ Phone: +1-555-0199 [Edit]    │  │                           │
│            │  │ Department: Engineering      │  │                           │
│            │  │ Position: Sr. Developer      │  │                           │
│            │  │ Address: [Edit Address]      │  │                           │
│            │  └──────────────────────────────┘  │                           │
│            └────────────────────────────────────┘                           │
│                              │                                               │
│                     Click [Edit] on Phone                                    │
│                              │                                               │
│                              ▼                                               │
│            ┌────────────────────────────────────┐                           │
│            │  EDIT PHONE                        │                           │
│            │  ┌──────────────────────────────┐  │                           │
│            │  │ Phone: [+1-555-0200      ]   │  │                           │
│            │  │        [Save] [Cancel]       │  │                           │
│            │  └──────────────────────────────┘  │                           │
│            └────────────────────────────────────┘                           │
│                              │                                               │
│                              ▼                                               │
│            ┌────────────────────────────────────┐                           │
│            │  "Phone number updated             │                           │
│            │   successfully!"                   │                           │
│            └────────────────────────────────────┘                           │
│                              │                                               │
│                              ▼                                               │
│                             END                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Steps**:
| Step | Action | System Response | Emotion |
|------|--------|-----------------|---------|
| 1 | Alice clicks "My Profile" | Profile page loads | Neutral |
| 2 | Reviews current information | All details displayed | Checking |
| 3 | Clicks Edit on Phone field | Field becomes editable | Focused |
| 4 | Enters new phone number | Real-time validation | Engaged |
| 5 | Clicks Save | Processing indicator | Anticipating |
| 6 | Sees success message | Profile updated | Satisfied |

**Note**: Employee can only edit limited fields (phone, address). Other fields like department, position are read-only.

---

### Journey 5: Edit Employee Details (HR Manager)

**Persona**: Sarah (HR Manager)
**Goal**: Update employee's department after internal transfer
**Trigger**: Employee transfer notification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EDIT EMPLOYEE DETAILS JOURNEY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  START ──► Search Employee ──► View Profile ──► Click "Edit"                │
│                                                        │                     │
│                                                        ▼                     │
│            ┌──────────────────────────────────────────────────────────┐     │
│            │  EDIT EMPLOYEE FORM                                       │     │
│            │  ┌────────────────────────────────────────────────────┐  │     │
│            │  │ Basic Info     [Editable]                          │  │     │
│            │  │ ─────────────────────────────────────────────────  │  │     │
│            │  │ First Name: [John          ]                       │  │     │
│            │  │ Last Name:  [Smith         ]                       │  │     │
│            │  │ Email:      [john.smith@company.com ]              │  │     │
│            │  │                                                     │  │     │
│            │  │ Employment   [Editable]                            │  │     │
│            │  │ ─────────────────────────────────────────────────  │  │     │
│            │  │ Department:  [Marketing    ▼] ← Changed from Eng  │  │     │
│            │  │ Position:    [Marketing Manager    ]               │  │     │
│            │  │ Manager:     [Select New Manager ▼]                │  │     │
│            │  │                                                     │  │     │
│            │  │           [Save Changes] [Cancel]                  │  │     │
│            │  └────────────────────────────────────────────────────┘  │     │
│            └──────────────────────────────────────────────────────────┘     │
│                                        │                                     │
│                                        ▼                                     │
│                              ┌─────────────────┐                            │
│                              │  Confirm Changes│                            │
│                              │  Dialog Box     │                            │
│                              └────────┬────────┘                            │
│                                       │                                      │
│                                       ▼                                      │
│            "Employee profile updated successfully"                          │
│                                       │                                      │
│                                       ▼                                      │
│                                      END                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Steps**:
| Step | Action | System Response | Emotion |
|------|--------|-----------------|---------|
| 1 | Search for employee | Results displayed | Focused |
| 2 | Open employee profile | Full profile shown | Neutral |
| 3 | Click "Edit" button | Form becomes editable | Engaged |
| 4 | Change department dropdown | New department selected | Focused |
| 5 | Update position | Position field updated | Engaged |
| 6 | Select new manager | Manager dropdown filtered by dept | Confident |
| 7 | Click "Save Changes" | Confirmation dialog appears | Careful |
| 8 | Confirm changes | Profile updated, audit logged | Satisfied |

---

### Journey 6: Delete Employee Record (Admin)

**Persona**: John (System Administrator)
**Goal**: Remove a terminated employee's record
**Trigger**: Employee termination with data cleanup request

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DELETE EMPLOYEE RECORD JOURNEY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  START ──► Search Employee ──► View Profile ──► Click "Delete"              │
│                                                        │                     │
│                                                        ▼                     │
│            ┌──────────────────────────────────────────────────────────┐     │
│            │  ⚠️  DELETE CONFIRMATION                                  │     │
│            │  ┌────────────────────────────────────────────────────┐  │     │
│            │  │                                                     │  │     │
│            │  │   Are you sure you want to delete this employee?   │  │     │
│            │  │                                                     │  │     │
│            │  │   Employee: John Smith (EMP-001234)                 │  │     │
│            │  │   Department: Engineering                           │  │     │
│            │  │                                                     │  │     │
│            │  │   ⚠️  This action cannot be undone.                 │  │     │
│            │  │                                                     │  │     │
│            │  │   Direct Reports: 3 employees                       │  │     │
│            │  │   → Will be reassigned to: [Select Manager ▼]      │  │     │
│            │  │                                                     │  │     │
│            │  │   Deletion Type:                                    │  │     │
│            │  │   ○ Soft Delete (Mark as Terminated)               │  │     │
│            │  │   ● Hard Delete (Remove all data)                  │  │     │
│            │  │                                                     │  │     │
│            │  │         [Confirm Delete] [Cancel]                  │  │     │
│            │  └────────────────────────────────────────────────────┘  │     │
│            └──────────────────────────────────────────────────────────┘     │
│                                        │                                     │
│                                        ▼                                     │
│                    Enter admin password for verification                     │
│                                        │                                     │
│                                        ▼                                     │
│                 "Employee record deleted successfully"                       │
│                                        │                                     │
│                                        ▼                                     │
│                      Redirect to Employee List                               │
│                                        │                                     │
│                                        ▼                                     │
│                                       END                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Steps**:
| Step | Action | System Response | Emotion |
|------|--------|-----------------|---------|
| 1 | Search for employee | Employee found | Focused |
| 2 | Open employee profile | Profile displayed | Neutral |
| 3 | Click "Delete" button | Confirmation dialog opens | Careful |
| 4 | Review impact summary | Direct reports shown | Cautious |
| 5 | Select manager for reassignment | Manager selected | Responsible |
| 6 | Choose deletion type | Option selected | Deliberate |
| 7 | Click "Confirm Delete" | Password verification prompt | Serious |
| 8 | Enter admin password | Deletion processed | Completing |
| 9 | See success message | Redirected to list | Relieved |

---

## 4. Journey Summary Matrix

| Journey | Primary Persona | Frequency | Complexity | Priority |
|---------|-----------------|-----------|------------|----------|
| Add New Employee | HR Manager | Daily | Medium | P1 |
| Search Employee | All Users | Very High | Low | P1 |
| View Analytics | HR/Manager | Weekly | Low | P1 |
| Update Own Profile | Employee | Monthly | Low | P2 |
| Edit Employee | HR Manager | Daily | Medium | P1 |
| Delete Employee | Admin | Rare | High | P2 |

---

## 5. Touchpoint Inventory

| Touchpoint | Pages/Screens | User Roles |
|------------|---------------|------------|
| Login | Login page | All |
| Dashboard | Home dashboard | All |
| Employee List | Employee listing | All |
| Employee Profile | Detail view | All |
| Add/Edit Form | Form pages | HR, Admin |
| Search | Search bar + results | All |
| Advanced Search | Filter panel | All |
| Analytics | Dashboard charts | HR, Manager |
| My Profile | Personal profile | Employee |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-19 | System | Initial version |