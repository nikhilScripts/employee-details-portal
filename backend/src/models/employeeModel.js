const { getDatabase } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate next employee ID in EMP-XXXXXX format
 * @returns {string} Generated employee ID
 */
function generateEmployeeId() {
  const db = getDatabase();
  const result = db.prepare(
    "SELECT MAX(CAST(SUBSTR(employee_id, 5) AS INTEGER)) as maxId FROM employees"
  ).get();
  
  const nextId = (result.maxId || 0) + 1;
  return `EMP-${String(nextId).padStart(6, '0')}`;
}

/**
 * Find all employees with pagination and filtering
 * @param {Object} options - Query options
 * @returns {Object} Paginated employees data
 */
function findAll(options = {}) {
  const db = getDatabase();
  const {
    page = 1,
    limit = 10,
    sort = 'created_at',
    order = 'DESC',
    department,
    status,
    type,
    search,
    managerId
  } = options;
  
  const offset = (page - 1) * limit;
  const allowedSortFields = ['first_name', 'last_name', 'email', 'department', 'hire_date', 'created_at', 'employee_id'];
  const sortField = allowedSortFields.includes(sort) ? sort : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  
  let query = 'SELECT * FROM employees WHERE 1=1';
  let countQuery = 'SELECT COUNT(*) as total FROM employees WHERE 1=1';
  const params = [];
  const countParams = [];
  
  if (department) {
    query += ' AND department = ?';
    countQuery += ' AND department = ?';
    params.push(department);
    countParams.push(department);
  }
  
  if (status) {
    query += ' AND employment_status = ?';
    countQuery += ' AND employment_status = ?';
    params.push(status);
    countParams.push(status);
  }
  
  if (type) {
    query += ' AND employment_type = ?';
    countQuery += ' AND employment_type = ?';
    params.push(type);
    countParams.push(type);
  }
  
  if (managerId) {
    query += ' AND manager_id = ?';
    countQuery += ' AND manager_id = ?';
    params.push(managerId);
    countParams.push(managerId);
  }
  
  if (search) {
    const searchTerm = `%${search}%`;
    query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR employee_id LIKE ?)';
    countQuery += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR employee_id LIKE ?)';
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  query += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  const employees = db.prepare(query).all(...params);
  const { total } = db.prepare(countQuery).get(...countParams);
  
  return {
    data: employees.map(transformEmployee),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Find employee by ID
 * @param {string} id - Employee UUID
 * @returns {Object|null} Employee data or null
 */
function findById(id) {
  const db = getDatabase();
  const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  return employee ? transformEmployee(employee) : null;
}

/**
 * Find employee by employee ID (EMP-XXXXXX)
 * @param {string} employeeId - Employee ID
 * @returns {Object|null} Employee data or null
 */
function findByEmployeeId(employeeId) {
  const db = getDatabase();
  const employee = db.prepare('SELECT * FROM employees WHERE employee_id = ?').get(employeeId);
  return employee ? transformEmployee(employee) : null;
}

/**
 * Find employee by email
 * @param {string} email - Employee email
 * @returns {Object|null} Employee data or null
 */
function findByEmail(email) {
  const db = getDatabase();
  const employee = db.prepare('SELECT * FROM employees WHERE email = ?').get(email);
  return employee ? transformEmployee(employee) : null;
}

/**
 * Create new employee
 * @param {Object} data - Employee data
 * @returns {Object} Created employee
 */
function create(data) {
  const db = getDatabase();
  const id = uuidv4();
  const employeeId = generateEmployeeId();
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO employees (
      id, employee_id, first_name, last_name, email, phone,
      department, position, employment_status, employment_type,
      hire_date, termination_date, manager_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    employeeId,
    data.firstName,
    data.lastName,
    data.email,
    data.phone || null,
    data.department,
    data.position || null,
    data.employmentStatus || 'Active',
    data.employmentType || 'Full-time',
    data.hireDate,
    data.terminationDate || null,
    data.managerId || null,
    now,
    now
  );
  
  return findById(id);
}

/**
 * Update employee by ID
 * @param {string} id - Employee UUID
 * @param {Object} data - Update data
 * @returns {Object|null} Updated employee or null
 */
function update(id, data) {
  const db = getDatabase();
  const existing = findById(id);
  if (!existing) return null;
  
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    UPDATE employees SET
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      department = COALESCE(?, department),
      position = COALESCE(?, position),
      employment_status = COALESCE(?, employment_status),
      employment_type = COALESCE(?, employment_type),
      hire_date = COALESCE(?, hire_date),
      termination_date = ?,
      manager_id = ?,
      updated_at = ?
    WHERE id = ?
  `);
  
  stmt.run(
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.department,
    data.position,
    data.employmentStatus,
    data.employmentType,
    data.hireDate,
    data.terminationDate !== undefined ? data.terminationDate : existing.terminationDate,
    data.managerId !== undefined ? data.managerId : existing.managerId,
    now,
    id
  );
  
  return findById(id);
}

/**
 * Delete employee by ID
 * @param {string} id - Employee UUID
 * @returns {boolean} True if deleted
 */
function remove(id) {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM employees WHERE id = ?').run(id);
  return result.changes > 0;
}

/**
 * Get direct reports for a manager
 * @param {string} managerId - Manager's UUID
 * @returns {Array} List of direct reports
 */
function getDirectReports(managerId) {
  const db = getDatabase();
  const reports = db.prepare('SELECT * FROM employees WHERE manager_id = ?').all(managerId);
  return reports.map(transformEmployee);
}

/**
 * Get all managers (employees with direct reports)
 * @returns {Array} List of managers
 */
function getManagers() {
  const db = getDatabase();
  const managers = db.prepare(`
    SELECT DISTINCT m.* FROM employees m
    INNER JOIN employees e ON e.manager_id = m.id
  `).all();
  return managers.map(transformEmployee);
}

/**
 * Get all employees who can be managers (for dropdown)
 * @param {string} excludeId - Employee ID to exclude (to prevent self-assignment)
 * @returns {Array} List of potential managers
 */
function getPotentialManagers(excludeId = null) {
  const db = getDatabase();
  let query = "SELECT id, employee_id, first_name, last_name, department, position FROM employees WHERE employment_status = 'Active'";
  const params = [];
  
  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }
  
  query += ' ORDER BY first_name, last_name';
  
  const managers = db.prepare(query).all(...params);
  return managers.map(m => ({
    id: m.id,
    employeeId: m.employee_id,
    firstName: m.first_name,
    lastName: m.last_name,
    fullName: `${m.first_name} ${m.last_name}`,
    department: m.department,
    position: m.position
  }));
}

/**
 * Check for circular reference in manager hierarchy
 * @param {string} employeeId - Employee UUID
 * @param {string} newManagerId - Proposed manager UUID
 * @returns {boolean} True if circular reference detected
 */
function hasCircularReference(employeeId, newManagerId) {
  if (!newManagerId || employeeId === newManagerId) return employeeId === newManagerId;
  
  const db = getDatabase();
  let currentId = newManagerId;
  const visited = new Set();
  
  while (currentId) {
    if (currentId === employeeId) return true;
    if (visited.has(currentId)) return true;
    visited.add(currentId);
    
    const manager = db.prepare('SELECT manager_id FROM employees WHERE id = ?').get(currentId);
    currentId = manager?.manager_id;
  }
  
  return false;
}

/**
 * Transform database row to API format
 * @param {Object} row - Database row
 * @returns {Object} Transformed employee
 */
function transformEmployee(row) {
  return {
    id: row.id,
    employeeId: row.employee_id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: `${row.first_name} ${row.last_name}`,
    email: row.email,
    phone: row.phone,
    department: row.department,
    position: row.position,
    employmentStatus: row.employment_status,
    employmentType: row.employment_type,
    hireDate: row.hire_date,
    terminationDate: row.termination_date,
    managerId: row.manager_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = {
  generateEmployeeId,
  findAll,
  findById,
  findByEmployeeId,
  findByEmail,
  create,
  update,
  remove,
  getDirectReports,
  getManagers,
  getPotentialManagers,
  hasCircularReference,
  transformEmployee
};