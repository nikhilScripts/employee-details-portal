const { getDatabase } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

// Admin emails list - users with these emails will be assigned ADMIN role
const ADMIN_EMAILS = [
  'n4nikhil51@gmail.com',
  'nikhil.gupta9@incedoinc.com'
];

/**
 * User Model - Handles user operations for SSO authentication
 */
class UserModel {
  /**
   * Find user by Microsoft ID
   */
  static findByMicrosoftId(microsoftId) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE microsoft_id = ?').get(microsoftId);
  }

  /**
   * Find user by email
   */
  static findByEmail(email) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  /**
   * Find user by ID
   */
  static findById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  /**
   * Create or update user from Microsoft SSO
   */
  static createOrUpdate(microsoftUser) {
    const db = getDatabase();
    const existingUser = this.findByMicrosoftId(microsoftUser.oid || microsoftUser.sub);

    // Determine role based on email
    const role = ADMIN_EMAILS.includes(microsoftUser.email?.toLowerCase()) ? 'ADMIN' : 'USER';

    if (existingUser) {
      // Update existing user
      const stmt = db.prepare(`
        UPDATE users SET
          display_name = ?,
          first_name = ?,
          last_name = ?,
          role = ?,
          last_login = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE microsoft_id = ?
      `);
      
      stmt.run(
        microsoftUser.name || microsoftUser.displayName,
        microsoftUser.given_name || microsoftUser.givenName,
        microsoftUser.family_name || microsoftUser.familyName,
        role,
        microsoftUser.oid || microsoftUser.sub
      );

      return this.findByMicrosoftId(microsoftUser.oid || microsoftUser.sub);
    } else {
      // Create new user
      const id = uuidv4();
      const stmt = db.prepare(`
        INSERT INTO users (id, microsoft_id, email, display_name, first_name, last_name, role, last_login)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);

      stmt.run(
        id,
        microsoftUser.oid || microsoftUser.sub,
        microsoftUser.email || microsoftUser.preferred_username,
        microsoftUser.name || microsoftUser.displayName || 'Unknown',
        microsoftUser.given_name || microsoftUser.givenName,
        microsoftUser.family_name || microsoftUser.familyName,
        role
      );

      // Initialize leave balances for new user
      this.initializeLeaveBalances(id);

      return this.findById(id);
    }
  }

  /**
   * Initialize leave balances for a new user
   */
  static initializeLeaveBalances(userId) {
    const db = getDatabase();
    const currentYear = new Date().getFullYear();
    
    // Get all leave types
    const leaveTypes = db.prepare('SELECT * FROM leave_types').all();
    
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO leave_balances (id, user_id, leave_type_id, year, total_days, used_days)
      VALUES (?, ?, ?, ?, ?, 0)
    `);

    leaveTypes.forEach(type => {
      stmt.run(uuidv4(), userId, type.id, currentYear, type.days_per_year);
    });
  }

  /**
   * Get all users (admin only)
   */
  static getAll() {
    const db = getDatabase();
    return db.prepare(`
      SELECT u.*, e.first_name as emp_first_name, e.last_name as emp_last_name, e.department
      FROM users u
      LEFT JOIN employees e ON u.employee_id = e.id
      ORDER BY u.display_name
    `).all();
  }

  /**
   * Update user role (admin only)
   */
  static updateRole(userId, role) {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(role, userId);
    return this.findById(userId);
  }

  /**
   * Link user to employee
   */
  static linkToEmployee(userId, employeeId) {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE users SET employee_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(employeeId, userId);
    return this.findById(userId);
  }
}

module.exports = UserModel;