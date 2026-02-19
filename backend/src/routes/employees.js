const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const employeeModel = require('../models/employeeModel');
const addressModel = require('../models/addressModel');

const router = express.Router();

// Validation middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array()
      }
    });
  }
  next();
};

// Validation rules
const employeeValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('hireDate').isISO8601().withMessage('Valid hire date is required'),
  body('employmentStatus').optional().isIn(['Active', 'Inactive', 'On Leave', 'Terminated']),
  body('employmentType').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Intern']),
  body('phone').optional().trim(),
  body('position').optional().trim(),
  body('managerId').optional({ nullable: true }).isUUID()
];

const addressValidation = [
  body('streetAddress').trim().notEmpty().withMessage('Street address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('country').optional().trim(),
  body('addressType').optional().isIn(['Current', 'Permanent', 'Emergency'])
];

// GET /api/employees - List all employees with pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sort').optional().isIn(['first_name', 'last_name', 'email', 'department', 'hire_date', 'created_at', 'employee_id']),
  query('order').optional().isIn(['asc', 'desc', 'ASC', 'DESC']),
  query('department').optional().trim(),
  query('status').optional().isIn(['Active', 'Inactive', 'On Leave', 'Terminated']),
  query('type').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Intern']),
  query('search').optional().trim(),
  query('managerId').optional().isUUID()
], handleValidation, (req, res) => {
  try {
    const result = employeeModel.findAll(req.query);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch employees'
      }
    });
  }
});

// GET /api/employees/managers - Get all potential managers
router.get('/managers', (req, res) => {
  try {
    const { exclude } = req.query;
    const managers = employeeModel.getPotentialManagers(exclude);
    res.json({
      success: true,
      data: managers
    });
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch managers'
      }
    });
  }
});

// GET /api/employees/:id - Get employee by ID
router.get('/:id', [
  param('id').isUUID().withMessage('Valid employee ID is required')
], handleValidation, (req, res) => {
  try {
    const employee = employeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Employee not found'
        }
      });
    }
    
    // Get addresses
    const addresses = addressModel.findByEmployeeId(req.params.id);
    
    // Get manager info if exists
    let manager = null;
    if (employee.managerId) {
      manager = employeeModel.findById(employee.managerId);
    }
    
    // Get direct reports
    const directReports = employeeModel.getDirectReports(req.params.id);
    
    res.json({
      success: true,
      data: {
        ...employee,
        addresses,
        manager: manager ? {
          id: manager.id,
          employeeId: manager.employeeId,
          fullName: manager.fullName,
          position: manager.position,
          department: manager.department
        } : null,
        directReports: directReports.map(r => ({
          id: r.id,
          employeeId: r.employeeId,
          fullName: r.fullName,
          position: r.position,
          department: r.department
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch employee'
      }
    });
  }
});

// POST /api/employees - Create new employee
router.post('/', employeeValidation, handleValidation, (req, res) => {
  try {
    // Check for duplicate email
    const existingEmail = employeeModel.findByEmail(req.body.email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_EMAIL',
          message: 'An employee with this email already exists'
        }
      });
    }
    
    // Check for circular manager reference
    if (req.body.managerId) {
      const manager = employeeModel.findById(req.body.managerId);
      if (!manager) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_MANAGER',
            message: 'Manager not found'
          }
        });
      }
    }
    
    const employee = employeeModel.create(req.body);
    
    // Create addresses if provided
    if (req.body.addresses && Array.isArray(req.body.addresses)) {
      for (const addr of req.body.addresses) {
        addressModel.create(employee.id, addr);
      }
    }
    
    const addresses = addressModel.findByEmployeeId(employee.id);
    
    res.status(201).json({
      success: true,
      data: {
        ...employee,
        addresses
      }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create employee'
      }
    });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', [
  param('id').isUUID().withMessage('Valid employee ID is required'),
  ...employeeValidation.map(v => v.optional())
], handleValidation, (req, res) => {
  try {
    const existing = employeeModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Employee not found'
        }
      });
    }
    
    // Check for duplicate email (if changing)
    if (req.body.email && req.body.email !== existing.email) {
      const existingEmail = employeeModel.findByEmail(req.body.email);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_EMAIL',
            message: 'An employee with this email already exists'
          }
        });
      }
    }
    
    // Check for circular manager reference
    if (req.body.managerId !== undefined) {
      if (req.body.managerId === req.params.id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_MANAGER',
            message: 'Employee cannot be their own manager'
          }
        });
      }
      
      if (req.body.managerId && employeeModel.hasCircularReference(req.params.id, req.body.managerId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CIRCULAR_REFERENCE',
            message: 'This would create a circular management hierarchy'
          }
        });
      }
    }
    
    const employee = employeeModel.update(req.params.id, req.body);
    const addresses = addressModel.findByEmployeeId(req.params.id);
    
    res.json({
      success: true,
      data: {
        ...employee,
        addresses
      }
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update employee'
      }
    });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', [
  param('id').isUUID().withMessage('Valid employee ID is required')
], handleValidation, (req, res) => {
  try {
    const existing = employeeModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Employee not found'
        }
      });
    }
    
    const deleted = employeeModel.remove(req.params.id);
    
    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete employee'
      }
    });
  }
});

// GET /api/employees/:id/addresses - Get employee addresses
router.get('/:id/addresses', [
  param('id').isUUID().withMessage('Valid employee ID is required')
], handleValidation, (req, res) => {
  try {
    const employee = employeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Employee not found'
        }
      });
    }
    
    const addresses = addressModel.findByEmployeeId(req.params.id);
    
    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch addresses'
      }
    });
  }
});

// POST /api/employees/:id/addresses - Add address to employee
router.post('/:id/addresses', [
  param('id').isUUID().withMessage('Valid employee ID is required'),
  ...addressValidation
], handleValidation, (req, res) => {
  try {
    const employee = employeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Employee not found'
        }
      });
    }
    
    const address = addressModel.create(req.params.id, req.body);
    
    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create address'
      }
    });
  }
});

module.exports = router;