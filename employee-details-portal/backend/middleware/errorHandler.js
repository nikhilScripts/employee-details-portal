// Enhanced error handling middleware

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  
  // Specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized access';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : undefined,
    timestamp: new Date().toISOString()
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};