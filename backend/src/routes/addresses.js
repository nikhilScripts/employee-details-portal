const express = require('express');
const { body, param, validationResult } = require('express-validator');
const addressModel = require('../models/addressModel');
const employeeModel = require('../models/employeeModel');

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
const addressValidation = [
  body('streetAddress').trim().notEmpty().withMessage('Street address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('country').optional().trim(),
  body('addressType').optional().isIn(['Current', 'Permanent', 'Emergency'])
];

// GET /api/addresses/:id - Get address by ID
router.get('/:id', [
  param('id').isUUID().withMessage('Valid address ID is required')
], handleValidation, (req, res) => {
  try {
    const address = addressModel.findById(req.params.id);
    if (!address) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Address not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch address'
      }
    });
  }
});

// PUT /api/addresses/:id - Update address
router.put('/:id', [
  param('id').isUUID().withMessage('Valid address ID is required'),
  ...addressValidation.map(v => v.optional())
], handleValidation, (req, res) => {
  try {
    const existing = addressModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Address not found'
        }
      });
    }
    
    const address = addressModel.update(req.params.id, req.body);
    
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update address'
      }
    });
  }
});

// DELETE /api/addresses/:id - Delete address
router.delete('/:id', [
  param('id').isUUID().withMessage('Valid address ID is required')
], handleValidation, (req, res) => {
  try {
    const existing = addressModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Address not found'
        }
      });
    }
    
    // Check if this is the last address
    const addressCount = addressModel.countByEmployeeId(existing.employeeId);
    if (addressCount <= 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'LAST_ADDRESS',
          message: 'Cannot delete the last address for an employee'
        }
      });
    }
    
    addressModel.remove(req.params.id);
    
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete address'
      }
    });
  }
});

// GET /api/addresses/locations/cities - Get unique cities
router.get('/locations/cities', (req, res) => {
  try {
    const cities = addressModel.getUniqueCities();
    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch cities'
      }
    });
  }
});

// GET /api/addresses/locations/states - Get unique states
router.get('/locations/states', (req, res) => {
  try {
    const states = addressModel.getUniqueStates();
    res.json({
      success: true,
      data: states
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch states'
      }
    });
  }
});

module.exports = router;