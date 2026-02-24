# Employee Details Portal - API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Currently, no authentication is required. This will be added in future stages.

## Response Format
All responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Array of validation errors (optional)"],
  "timestamp": "ISO 8601 timestamp"
}
```

## Endpoints

### 1. Get API Information
Returns basic API information and available endpoints.

**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "Employee Details Portal API - Node.js 17",
  "version": "1.0.0",
  "endpoints": {
    "employees": "/api/employees",
    "employee": "/api/employees/:id"
  }
}
```

---

### 2. Get All Employees
Retrieve a list of all employees.

**Endpoint:** `GET /api/employees`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "department": "Engineering",
      "position": "Software Engineer",
      "joinDate": "2020-01-15"
    }
  ]
}
```

**Status Codes:**
- `200` - Success

---

### 3. Get Employee by ID
Retrieve a single employee by their ID.

**Endpoint:** `GET /api/employees/:id`

**Parameters:**
- `id` (path parameter) - Employee ID (must be a positive integer)

**Example:** `GET /api/employees/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "department": "Engineering",
    "position": "Software Engineer",
    "joinDate": "2020-01-15"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid employee ID
- `404` - Employee not found

**Error Response Example:**
```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

### 4. Create New Employee
Create a new employee record.

**Endpoint:** `POST /api/employees`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "department": "Marketing",
  "position": "Marketing Manager",
  "joinDate": "2024-02-24"
}
```

**Required Fields:**
- `firstName` (string, min 2 characters)
- `lastName` (string, min 2 characters)
- `email` (string, valid email format)

**Optional Fields:**
- `department` (string)
- `position` (string)
- `joinDate` (string, format: YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 3,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "department": "Marketing",
    "position": "Marketing Manager",
    "joinDate": "2024-02-24"
  }
}
```

**Status Codes:**
- `201` - Employee created successfully
- `400` - Validation error

**Validation Error Example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "First name is required",
    "Invalid email format",
    "Join date must be in YYYY-MM-DD format"
  ]
}
```

---

### 5. Update Employee
Update an existing employee's information.

**Endpoint:** `PUT /api/employees/:id`

**Parameters:**
- `id` (path parameter) - Employee ID

**Request Body:** (all fields optional)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.updated@example.com",
  "department": "Senior Engineering",
  "position": "Lead Software Engineer",
  "joinDate": "2020-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.updated@example.com",
    "department": "Senior Engineering",
    "position": "Lead Software Engineer",
    "joinDate": "2020-01-15"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid employee ID
- `404` - Employee not found

---

### 6. Delete Employee
Delete an employee record.

**Endpoint:** `DELETE /api/employees/:id`

**Parameters:**
- `id` (path parameter) - Employee ID

**Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "department": "Engineering",
    "position": "Software Engineer",
    "joinDate": "2020-01-15"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid employee ID
- `404` - Employee not found

---

## Error Handling

### Common Error Codes
- `400` - Bad Request (validation errors, invalid input)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### 404 Not Found
Any undefined route will return:
```json
{
  "success": false,
  "message": "Route /invalid/route not found",
  "timestamp": "2026-02-24T15:23:00.000Z"
}
```

---

## Validation Rules

### Employee Data Validation

**First Name:**
- Required
- Minimum 2 characters
- Cannot be empty or whitespace only

**Last Name:**
- Required
- Minimum 2 characters
- Cannot be empty or whitespace only

**Email:**
- Required
- Must be valid email format (user@domain.com)

**Join Date:**
- Optional
- Must be in YYYY-MM-DD format if provided

**Department & Position:**
- Optional
- No validation rules

---

## cURL Examples

### Get all employees
```bash
curl http://localhost:3000/api/employees
```

### Get employee by ID
```bash
curl http://localhost:3000/api/employees/1
```

### Create new employee
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@example.com",
    "department": "Sales",
    "position": "Sales Representative"
  }'
```

### Update employee
```bash
curl -X PUT http://localhost:3000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Senior Software Engineer"
  }'
```

### Delete employee
```bash
curl -X DELETE http://localhost:3000/api/employees/1
```

---

## Notes

- All timestamps are in ISO 8601 format
- The API uses in-memory storage (data resets on server restart)
- Database integration will be added in Stage 3
- Request logging is enabled for all endpoints
- CORS is enabled for all origins

---

**Version:** 1.0.0  
**Last Updated:** February 24, 2026  
**Stage:** 2 - Core Backend Development Complete