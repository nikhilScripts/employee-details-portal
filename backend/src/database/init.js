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
  
  // Create indexes for common queries
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
    CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(employment_status);
    CREATE INDEX IF NOT EXISTS idx_employees_manager ON employees(manager_id);
    CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(first_name, last_name);
    CREATE INDEX IF NOT EXISTS idx_addresses_employee ON addresses(employee_id);
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