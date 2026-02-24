const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { validateEmployee, validateEmployeeId } = require('./middleware/validation');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const db = require('./database/dbManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database on startup
db.load().then(() => {
  console.log('Database loaded successfully');
}).catch(err => {
  console.error('Error loading database:', err);
});

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
app.get('/api/employees', async (req, res, next) => {
  try {
    const employees = await db.getAllEmployees();
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
});

// GET single employee by ID
app.get('/api/employees/:id', validateEmployeeId, async (req, res, next) => {
  try {
    const employee = await db.getEmployeeById(req.employeeId);
    
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
  } catch (error) {
    next(error);
  }
});

// POST create new employee
app.post('/api/employees', validateEmployee, async (req, res, next) => {
  try {
    const { firstName, lastName, email, department, position, joinDate } = req.body;
    
    // Check if email already exists
    const emailExists = await db.emailExists(email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    const newEmployee = await db.createEmployee({
      firstName,
      lastName,
      email,
      department: department || '',
      position: position || ''  ,
      joinDate
    });
    
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee
    });
  } catch (error) {
    next(error);
  }
});

// PUT update employee
app.put('/api/employees/:id', validateEmployeeId, async (req, res, next) => {
  try {
    const { firstName, lastName, email, department, position, joinDate } = req.body;
    
    // Check if email exists for different employee
    if (email) {
      const emailExists = await db.emailExists(email, req.employeeId);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }
    
    const updatedEmployee = await db.updateEmployee(req.employeeId, {
      firstName,
      lastName,
      email,
      department,
      position,
      joinDate
    });
    
    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    next(error);
  }
});

// DELETE employee
app.delete('/api/employees/:id', validateEmployeeId, async (req, res, next) => {
  try {
    const deletedEmployee = await db.deleteEmployee(req.employeeId);
    
    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Employee deleted successfully',
      data: deletedEmployee
    });
  } catch (error) {
    next(error);
  }
});

// 404 handler for undefined routes
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Employee Details Portal API running on Node.js ${process.version}`);
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;