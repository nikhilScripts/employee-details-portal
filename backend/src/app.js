const express = require('express');
const cors = require('cors');
const { initSchema } = require('./database/init');

// Import routes
const employeesRouter = require('./routes/employees');
const addressesRouter = require('./routes/addresses');
const analyticsRouter = require('./routes/analytics');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });
}

// Initialize database schema
initSchema();

// API Routes
app.use('/api/employees', employeesRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/analytics', analyticsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.url}`
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

module.exports = app;