const express = require('express');
const LeaveModel = require('../models/leaveModel');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ==================== LEAVE TYPES ====================

/**
 * @route GET /api/leaves/types
 * @desc Get all leave types
 */
router.get('/types', authenticate, (req, res) => {
  try {
    const types = LeaveModel.getAllLeaveTypes();
    res.json({ leaveTypes: types });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LEAVE BALANCES ====================

/**
 * @route GET /api/leaves/balance
 * @desc Get current user's leave balances
 */
router.get('/balance', authenticate, (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const balances = LeaveModel.getBalancesByUserId(req.user.id, parseInt(year));
    res.json({ balances, year });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/leaves/balance/:userId
 * @desc Get specific user's leave balances (admin only)
 */
router.get('/balance/:userId', authenticate, requireAdmin, (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const balances = LeaveModel.getBalancesByUserId(req.params.userId, parseInt(year));
    res.json({ balances, year });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LEAVE REQUESTS ====================

/**
 * @route POST /api/leaves/request
 * @desc Create a new leave request
 */
router.post('/request', authenticate, (req, res) => {
  try {
    const { leaveTypeId, startDate, endDate, reason } = req.body;

    // Validation
    if (!leaveTypeId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Leave type, start date, and end date are required' });
    }

    // Check if start date is before end date
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    // Check balance before creating request
    const balance = LeaveModel.getBalance(req.user.id, leaveTypeId);
    const daysCount = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    
    if (balance && balance.remaining_days < daysCount) {
      return res.status(400).json({ 
        error: `Insufficient leave balance. You have ${balance.remaining_days} days remaining.` 
      });
    }

    const request = LeaveModel.createRequest(req.user.id, leaveTypeId, startDate, endDate, reason);
    res.status(201).json({ request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/leaves/requests
 * @desc Get current user's leave requests
 */
router.get('/requests', authenticate, (req, res) => {
  try {
    const { status, year } = req.query;
    const requests = LeaveModel.getRequestsByUserId(req.user.id, { status, year: year ? parseInt(year) : undefined });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/leaves/requests/:id
 * @desc Get specific leave request
 */
router.get('/requests/:id', authenticate, (req, res) => {
  try {
    const request = LeaveModel.getRequestById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Users can only view their own requests, admins can view all
    if (req.user.role !== 'ADMIN' && request.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PUT /api/leaves/requests/:id/cancel
 * @desc Cancel a leave request
 */
router.put('/requests/:id/cancel', authenticate, (req, res) => {
  try {
    const request = LeaveModel.cancelRequest(req.params.id, req.user.id);
    res.json({ request, message: 'Leave request cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

/**
 * @route GET /api/leaves/admin/requests
 * @desc Get all leave requests (admin only)
 */
router.get('/admin/requests', authenticate, requireAdmin, (req, res) => {
  try {
    const { status, year, userId } = req.query;
    const requests = LeaveModel.getAllRequests({ 
      status, 
      year: year ? parseInt(year) : undefined,
      userId 
    });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PUT /api/leaves/admin/requests/:id/approve
 * @desc Approve a leave request (admin only)
 */
router.put('/admin/requests/:id/approve', authenticate, requireAdmin, (req, res) => {
  try {
    const request = LeaveModel.approveRequest(req.params.id, req.user.id);
    res.json({ request, message: 'Leave request approved successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route PUT /api/leaves/admin/requests/:id/reject
 * @desc Reject a leave request (admin only)
 */
router.put('/admin/requests/:id/reject', authenticate, requireAdmin, (req, res) => {
  try {
    const { reason } = req.body;
    const request = LeaveModel.rejectRequest(req.params.id, req.user.id, reason);
    res.json({ request, message: 'Leave request rejected' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== REPORTS ====================

/**
 * @route GET /api/leaves/reports
 * @desc Get leave report (admin only)
 */
router.get('/reports', authenticate, requireAdmin, (req, res) => {
  try {
    const { year, userId, month } = req.query;
    const report = LeaveModel.getLeaveReport({
      year: year ? parseInt(year) : undefined,
      userId,
      month: month ? parseInt(month) : undefined
    });
    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/leaves/reports/stats
 * @desc Get leave statistics (admin only)
 */
router.get('/reports/stats', authenticate, requireAdmin, (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const stats = LeaveModel.getLeaveStats(parseInt(year));
    res.json({ stats, year });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/leaves/reports/export
 * @desc Export leave report as CSV (admin only)
 */
router.get('/reports/export', authenticate, requireAdmin, (req, res) => {
  try {
    const { year, userId, month } = req.query;
    const report = LeaveModel.getLeaveReport({
      year: year ? parseInt(year) : undefined,
      userId,
      month: month ? parseInt(month) : undefined
    });

    // Generate CSV
    const headers = ['Employee', 'Email', 'Leave Type', 'Approved', 'Rejected', 'Pending', 'Days Taken', 'Total Days', 'Used Days', 'Remaining'];
    const rows = report.map(r => [
      r.display_name,
      r.email,
      r.leave_type,
      r.approved_count || 0,
      r.rejected_count || 0,
      r.pending_count || 0,
      r.total_days_taken || 0,
      r.total_days || 0,
      r.used_days || 0,
      r.remaining_days || 0
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leave-report-${year || 'all'}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;