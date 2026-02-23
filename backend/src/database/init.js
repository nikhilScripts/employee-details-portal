const Database = require('better-sqlite3');
const path = require('path');

let db = null;

/**
 * Initialize database connection
 * @param {string} dbPath - Path to database file (optional, uses default if not provided)
 * @returns {Database} SQLite database instance
 */
function initDatabase(dbPath = null) {
  if (db) return db;
  
  const actualPath = dbPath || process.env.DB_PATH || path.join(__dirname, '../../data/employees.db');
  
  db = new Database(actualPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  
  return db;
}

/**
 * Get database instance
 * @returns {Database} SQLite database instance
 */
function getDatabase() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

/**
 * Close database connection
 */
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Initialize database schema
 */
function initSchema() {
  const database = getDatabase();
  
  // Create employees table
  database.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      employee_id TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      department TEXT NOT NULL,
      position TEXT,
      employment_status TEXT DEFAULT 'Active' CHECK(employment_status IN ('Active', 'Inactive', 'On Leave', 'Terminated')),
      employment_type TEXT DEFAULT 'Full-time' CHECK(employment_type IN ('Full-time', 'Part-time', 'Contract', 'Intern')),
      hire_date TEXT NOT NULL,
      termination_date TEXT,
      manager_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
    )
  `);
  
  // Create addresses table
  database.exec(`
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      street_address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT DEFAULT 'USA',
      address_type TEXT DEFAULT 'Current' CHECK(address_type IN ('Current', 'Permanent', 'Emergency')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    )
  `);
  
  // Create users table for SSO authentication
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      microsoft_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      role TEXT DEFAULT 'USER' CHECK(role IN ('ADMIN', 'USER')),
      employee_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login TEXT,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
    )
  `);

  // Create leave_types table
  database.exec(`
    CREATE TABLE IF NOT EXISTS leave_types (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      days_per_year INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create leave_balances table
  database.exec(`
    CREATE TABLE IF NOT EXISTS leave_balances (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      leave_type_id TEXT NOT NULL,
      year INTEGER NOT NULL,
      total_days INTEGER DEFAULT 0,
      used_days INTEGER DEFAULT 0,
      remaining_days INTEGER GENERATED ALWAYS AS (total_days - used_days) VIRTUAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, leave_type_id, year),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE
    )
  `);

  // Create leave_requests table
  database.exec(`
    CREATE TABLE IF NOT EXISTS leave_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      leave_type_id TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      days_count INTEGER NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
      approved_by TEXT,
      approved_at TEXT,
      rejection_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE,
      FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Insert default leave types
  database.exec(`
    INSERT OR IGNORE INTO leave_types (id, name, description, days_per_year) VALUES
      ('lt-sick', 'Sick Leave', 'Leave for medical reasons', 12),
      ('lt-casual', 'Casual Leave', 'Leave for personal matters', 12),
      ('lt-paid', 'Paid Leave', 'Annual paid vacation leave', 15),
      ('lt-unpaid', 'Unpaid Leave', 'Leave without pay', 0)
  `);

  // Create indexes for common queries
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
    CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(employment_status);
    CREATE INDEX IF NOT EXISTS idx_employees_manager ON employees(manager_id);
    CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(first_name, last_name);
    CREATE INDEX IF NOT EXISTS idx_addresses_employee ON addresses(employee_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_microsoft_id ON users(microsoft_id);
    CREATE INDEX IF NOT EXISTS idx_leave_requests_user ON leave_requests(user_id);
    CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
    CREATE INDEX IF NOT EXISTS idx_leave_balances_user ON leave_balances(user_id);
  `);
  
  return database;
}

/**
 * Reset database for testing
 */
function resetDatabase() {
  const database = getDatabase();
  database.exec('DELETE FROM addresses');
  database.exec('DELETE FROM employees');
}

/**
 * Set database instance (for testing)
 * @param {Database} newDb - Database instance to use
 */
function setDatabase(newDb) {
  db = newDb;
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
  initSchema,
  resetDatabase,
  setDatabase
};