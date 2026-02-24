const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory data store (will be replaced with database in Stage 3)
let employees = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    position: 'Software Engineer',
    joinDate: '2020-01-15'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2019-03-20'
  }
];

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Employee Details Portal API - Node.js 17',
    version: '1.0.0',
    endpoints: {
      employees: '/api/employees',
      employee: '/api/employees/:id'
    }
  });
});

// GET all employees
app.get('/api/employees', (req, res) => {
  res.json({
    success: true,
    count: employees.length,
    data: employees
  });
});

// GET single employee by ID
app.get('/api/employees/:id', (req, res) => {
  const employee = employees.find(emp => emp.id === parseInt(req.params.id));
  
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }
  
  res.json({
    success: true,
    data: employee
  });
});

// POST create new employee
app.post('/api/employees', (req, res) => {
  const { firstName, lastName, email, department, position, joinDate } = req.body;
  
  // Basic validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      message: 'First name, last name, and email are required'
    });
  }
  
  const newEmployee = {
    id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    firstName,
    lastName,
    email,
    department: department || '',
    position: position || '',
    joinDate: joinDate || new Date().toISOString().split('T')[0]
  };
  
  employees.push(newEmployee);
  
  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: newEmployee
  });
});

// PUT update employee
app.put('/api/employees/:id', (req, res) => {
  const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));
  
  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }
  
  const { firstName, lastName, email, department, position, joinDate } = req.body;
  
  employees[employeeIndex] = {
    ...employees[employeeIndex],
    firstName: firstName || employees[employeeIndex].firstName,
    lastName: lastName || employees[employeeIndex].lastName,
    email: email || employees[employeeIndex].email,
    department: department !== undefined ? department : employees[employeeIndex].department,
    position: position !== undefined ? position : employees[employeeIndex].position,
    joinDate: joinDate || employees[employeeIndex].joinDate
  };
  
  res.json({
    success: true,
    message: 'Employee updated successfully',
    data: employees[employeeIndex]
  });
});

// DELETE employee
app.delete('/api/employees/:id', (req, res) => {
  const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));
  
  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }
  
  const deletedEmployee = employees.splice(employeeIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Employee deleted successfully',
    data: deletedEmployee
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Employee Details Portal API running on Node.js ${process.version}`);
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;