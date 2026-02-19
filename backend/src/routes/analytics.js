const express = require('express');
const { getDatabase } = require('../database/init');

const router = express.Router();

// GET /api/analytics/summary - Dashboard summary stats
router.get('/summary', (req, res) => {
  try {
    const db = getDatabase();
    
    const total = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
    const active = db.prepare("SELECT COUNT(*) as count FROM employees WHERE employment_status = 'Active'").get().count;
    const departments = db.prepare('SELECT COUNT(DISTINCT department) as count FROM employees').get().count;
    
    // New hires (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newHires = db.prepare(
      "SELECT COUNT(*) as count FROM employees WHERE hire_date >= ?"
    ).get(thirtyDaysAgo.toISOString().split('T')[0]).count;
    
    res.json({
      success: true,
      data: {
        totalEmployees: total,
        activeEmployees: active,
        totalDepartments: departments,
        newHiresLast30Days: newHires
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch summary'
      }
    });
  }
});

// GET /api/analytics/department - Employees by department
router.get('/department', (req, res) => {
  try {
    const db = getDatabase();
    
    const data = db.prepare(`
      SELECT department as name, COUNT(*) as value 
      FROM employees 
      GROUP BY department 
      ORDER BY value DESC
    `).all();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch department statistics'
      }
    });
  }
});

// GET /api/analytics/status - Employees by employment status
router.get('/status', (req, res) => {
  try {
    const db = getDatabase();
    
    const data = db.prepare(`
      SELECT employment_status as name, COUNT(*) as value 
      FROM employees 
      GROUP BY employment_status 
      ORDER BY value DESC
    `).all();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching status stats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch status statistics'
      }
    });
  }
});

// GET /api/analytics/type - Employees by employment type
router.get('/type', (req, res) => {
  try {
    const db = getDatabase();
    
    const data = db.prepare(`
      SELECT employment_type as name, COUNT(*) as value 
      FROM employees 
      GROUP BY employment_type 
      ORDER BY value DESC
    `).all();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching type stats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch type statistics'
      }
    });
  }
});

// GET /api/analytics/location - Employees by location (city)
router.get('/location', (req, res) => {
  try {
    const db = getDatabase();
    
    const data = db.prepare(`
      SELECT a.city as name, COUNT(DISTINCT a.employee_id) as value 
      FROM addresses a
      WHERE a.address_type = 'Current'
      GROUP BY a.city 
      ORDER BY value DESC
      LIMIT 10
    `).all();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching location stats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch location statistics'
      }
    });
  }
});

// GET /api/analytics/tenure - Employees by tenure brackets
router.get('/tenure', (req, res) => {
  try {
    const db = getDatabase();
    
    const employees = db.prepare(`
      SELECT hire_date FROM employees WHERE employment_status = 'Active'
    `).all();
    
    const today = new Date();
    const brackets = {
      '< 1 year': 0,
      '1-2 years': 0,
      '2-5 years': 0,
      '5-10 years': 0,
      '10+ years': 0
    };
    
    employees.forEach(emp => {
      const hireDate = new Date(emp.hire_date);
      const years = (today - hireDate) / (365.25 * 24 * 60 * 60 * 1000);
      
      if (years < 1) brackets['< 1 year']++;
      else if (years < 2) brackets['1-2 years']++;
      else if (years < 5) brackets['2-5 years']++;
      else if (years < 10) brackets['5-10 years']++;
      else brackets['10+ years']++;
    });
    
    const data = Object.entries(brackets).map(([name, value]) => ({ name, value }));
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching tenure stats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch tenure statistics'
      }
    });
  }
});

// GET /api/analytics/departments/list - Get unique departments
router.get('/departments/list', (req, res) => {
  try {
    const db = getDatabase();
    
    const departments = db.prepare(
      'SELECT DISTINCT department FROM employees ORDER BY department'
    ).all();
    
    res.json({
      success: true,
      data: departments.map(d => d.department)
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch departments'
      }
    });
  }
});

module.exports = router;