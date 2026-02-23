const { getDatabase } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

/**
 * Leave Model - Handles leave requests and balances
 */
class LeaveModel {
  // ==================== LEAVE TYPES ====================
  
  /**
   * Get all leave types
   */
  static getAllLeaveTypes() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM leave_types ORDER BY name').all();
  }

  /**
   * Get leave type by ID
   */
  static getLeaveTypeById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM leave_types WHERE id = ?').get(id);
  }

  // ==================== LEAVE BALANCES ====================

  /**
   * Get leave balances for a user
   */
  static getBalancesByUserId(userId, year = new Date().getFullYear()) {
    const db = getDatabase();
    return db.prepare(`
      SELECT lb.*, lt.name as leave_type_name, lt.description
      FROM leave_balances lb
      JOIN leave_types lt ON lb.leave_type_id = lt.id
      WHERE lb.user_id = ? AND lb.year = ?
      ORDER BY lt.name
    `).all(userId, year);
  }

  /**
   * Get specific leave balance
   */
  static getBalance(userId, leaveTypeId, year = new Date().getFullYear()) {
    const db = getDatabase();
    return db.prepare(`
      SELECT lb.*, lt.name as leave_type_name
      FROM leave_balances lb
      JOIN leave_types lt ON lb.leave_type_id = lt.id
      WHERE lb.user_id = ? AND lb.leave_type_id = ? AND lb.year = ?
    `).get(userId, leaveTypeId, year);
  }

  /**
   * Update leave balance (used when leave is approved)
   */
  static updateBalance(userId, leaveTypeId, daysUsed, year = new Date().getFullYear()) {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE leave_balances 
      SET used_days = used_days + ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND leave_type_id = ? AND year = ?
    `);
    return stmt.run(daysUsed, userId, leaveTypeId, year);
  }

  /**
   * Revert leave balance (used when leave is cancelled/rejected after approval)
   */
  static revertBalance(userId, leaveTypeId, daysToRevert, year = new Date().getFullYear()) {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE leave_balances 
      SET used_days = MAX(0, used_days - ?), updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND leave_type_id = ? AND year = ?
    `);
    return stmt.run(daysToRevert, userId, leaveTypeId, year);
  }

  // ==================== LEAVE REQUESTS ====================

  /**
   * Create a new leave request
   */
  static createRequest(userId, leaveTypeId, startDate, endDate, reason) {
    const db = getDatabase();
    const id = uuidv4();
    
    // Calculate days count (simple calculation, excludes weekends in real app)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const stmt = db.prepare(`
      INSERT INTO leave_requests (id, user_id, leave_type_id, start_date, end_date, days_count, reason)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId, leaveTypeId, startDate, endDate, daysCount, reason);
    return this.getRequestById(id);
  }

  /**
   * Get leave request by ID
   */
  static getRequestById(id) {
    const db = getDatabase();
    return db.prepare(`
      SELECT lr.*, lt.name as leave_type_name, 
             u.display_name as user_name, u.email as user_email,
             approver.display_name as approved_by_name
      FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      JOIN users u ON lr.user_id = u.id
      LEFT JOIN users approver ON lr.approved_by = approver.id
      WHERE lr.id = ?
    `).get(id);
  }

  /**
   * Get leave requests for a user
   */
  static getRequestsByUserId(userId, options = {}) {
    const db = getDatabase();
    const { status, year, limit = 50, offset = 0 } = options;
    
    let query = `
      SELECT lr.*, lt.name as leave_type_name,
             approver.display_name as approved_by_name
      FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      LEFT JOIN users approver ON lr.approved_by = approver.id
      WHERE lr.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ' AND lr.status = ?';
      params.push(status);
    }

    if (year) {
      query += ' AND strftime("%Y", lr.start_date) = ?';
      params.push(year.toString());
    }

    query += ' ORDER BY lr.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return db.prepare(query).all(...params);
  }

  /**
   * Get all leave requests (admin only)
   */
  static getAllRequests(options = {}) {
    const db = getDatabase();
    const { status, year, userId, limit = 100, offset = 0 } = options;

    let query = `
      SELECT lr.*, lt.name as leave_type_name,
             u.display_name as user_name, u.email as user_email,
             approver.display_name as approved_by_name
      FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      JOIN users u ON lr.user_id = u.id
      LEFT JOIN users approver ON lr.approved_by = approver.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND lr.status = ?';
      params.push(status);
    }

    if (year) {
      query += ' AND strftime("%Y", lr.start_date) = ?';
      params.push(year.toString());
    }

    if (userId) {
      query += ' AND lr.user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY lr.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return db.prepare(query).all(...params);
  }

  /**
   * Approve leave request (admin only)
   */
  static approveRequest(requestId, approvedBy) {
    const db = getDatabase();
    const request = this.getRequestById(requestId);
    
    if (!request) throw new Error('Leave request not found');
    if (request.status !== 'PENDING') throw new Error('Only pending requests can be approved');

    // Check balance
    const balance = this.getBalance(request.user_id, request.leave_type_id);
    if (balance && balance.remaining_days < request.days_count) {
      throw new Error('Insufficient leave balance');
    }

    // Update request status
    const stmt = db.prepare(`
      UPDATE leave_requests 
      SET status = 'APPROVED', approved_by = ?, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(approvedBy, requestId);

    // Deduct from balance
    this.updateBalance(request.user_id, request.leave_type_id, request.days_count);

    return this.getRequestById(requestId);
  }

  /**
   * Reject leave request (admin only)
   */
  static rejectRequest(requestId, approvedBy, rejectionReason) {
    const db = getDatabase();
    const request = this.getRequestById(requestId);
    
    if (!request) throw new Error('Leave request not found');
    if (request.status !== 'PENDING') throw new Error('Only pending requests can be rejected');

    const stmt = db.prepare(`
      UPDATE leave_requests 
      SET status = 'REJECTED', approved_by = ?, approved_at = CURRENT_TIMESTAMP, 
          rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(approvedBy, rejectionReason, requestId);

    return this.getRequestById(requestId);
  }

  /**
   * Cancel leave request (by user)
   */
  static cancelRequest(requestId, userId) {
    const db = getDatabase();
    const request = this.getRequestById(requestId);
    
    if (!request) throw new Error('Leave request not found');
    if (request.user_id !== userId) throw new Error('You can only cancel your own requests');
    if (request.status === 'CANCELLED') throw new Error('Request already cancelled');

    // If it was approved, revert balance
    if (request.status === 'APPROVED') {
      this.revertBalance(request.user_id, request.leave_type_id, request.days_count);
    }

    const stmt = db.prepare(`
      UPDATE leave_requests SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    stmt.run(requestId);

    return this.getRequestById(requestId);
  }

  // ==================== REPORTS ====================

  /**
   * Get leave summary report
   */
  static getLeaveReport(options = {}) {
    const db = getDatabase();
    const { year = new Date().getFullYear(), userId, month } = options;

    let query = `
      SELECT 
        u.id as user_id,
        u.display_name,
        u.email,
        lt.name as leave_type,
        COUNT(CASE WHEN lr.status = 'APPROVED' THEN 1 END) as approved_count,
        COUNT(CASE WHEN lr.status = 'REJECTED' THEN 1 END) as rejected_count,
        COUNT(CASE WHEN lr.status = 'PENDING' THEN 1 END) as pending_count,
        SUM(CASE WHEN lr.status = 'APPROVED' THEN lr.days_count ELSE 0 END) as total_days_taken,
        lb.total_days,
        lb.used_days,
        (lb.total_days - lb.used_days) as remaining_days
      FROM users u
      CROSS JOIN leave_types lt
      LEFT JOIN leave_requests lr ON u.id = lr.user_id AND lt.id = lr.leave_type_id
        AND strftime('%Y', lr.start_date) = ?
      LEFT JOIN leave_balances lb ON u.id = lb.user_id AND lt.id = lb.leave_type_id AND lb.year = ?
      WHERE 1=1
    `;
    const params = [year.toString(), year];

    if (userId) {
      query += ' AND u.id = ?';
      params.push(userId);
    }

    if (month) {
      query += ' AND strftime("%m", lr.start_date) = ?';
      params.push(month.toString().padStart(2, '0'));
    }

    query += ' GROUP BY u.id, lt.id ORDER BY u.display_name, lt.name';

    return db.prepare(query).all(...params);
  }

  /**
   * Get aggregated leave statistics
   */
  static getLeaveStats(year = new Date().getFullYear()) {
    const db = getDatabase();
    return db.prepare(`
      SELECT 
        lt.name as leave_type,
        COUNT(DISTINCT lr.user_id) as employees_used,
        SUM(CASE WHEN lr.status = 'APPROVED' THEN lr.days_count ELSE 0 END) as total_days_taken,
        COUNT(CASE WHEN lr.status = 'PENDING' THEN 1 END) as pending_requests,
        COUNT(CASE WHEN lr.status = 'APPROVED' THEN 1 END) as approved_requests,
        COUNT(CASE WHEN lr.status = 'REJECTED' THEN 1 END) as rejected_requests
      FROM leave_types lt
      LEFT JOIN leave_requests lr ON lt.id = lr.leave_type_id 
        AND strftime('%Y', lr.start_date) = ?
      GROUP BY lt.id
      ORDER BY lt.name
    `).all(year.toString());
  }
}

module.exports = LeaveModel;