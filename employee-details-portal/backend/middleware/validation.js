// Validation middleware for employee data

const validateEmployee = (req, res, next) => {
  const { firstName, lastName, email, department, position, joinDate } = req.body;
  const errors = [];

  // Required fields validation
  if (!firstName || firstName.trim() === '') {
    errors.push('First name is required');
  }
  
  if (!lastName || lastName.trim() === '') {
    errors.push('Last name is required');
  }
  
  if (!email || email.trim() === '') {
    errors.push('Email is required');
  }

  // Email format validation
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  // Name length validation
  if (firstName && firstName.length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  
  if (lastName && lastName.length < 2) {
    errors.push('Last name must be at least 2 characters');
  }

  // Date format validation
  if (joinDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(joinDate)) {
      errors.push('Join date must be in YYYY-MM-DD format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

const validateEmployeeId = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID'
    });
  }
  
  req.employeeId = id;
  next();
};

module.exports = {
  validateEmployee,
  validateEmployeeId
};