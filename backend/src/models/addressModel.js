const { getDatabase } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

/**
 * Find all addresses for an employee
 * @param {string} employeeId - Employee UUID
 * @returns {Array} List of addresses
 */
function findByEmployeeId(employeeId) {
  const db = getDatabase();
  const addresses = db.prepare('SELECT * FROM addresses WHERE employee_id = ? ORDER BY address_type').all(employeeId);
  return addresses.map(transformAddress);
}

/**
 * Find address by ID
 * @param {string} id - Address UUID
 * @returns {Object|null} Address or null
 */
function findById(id) {
  const db = getDatabase();
  const address = db.prepare('SELECT * FROM addresses WHERE id = ?').get(id);
  return address ? transformAddress(address) : null;
}

/**
 * Create new address
 * @param {string} employeeId - Employee UUID
 * @param {Object} data - Address data
 * @returns {Object} Created address
 */
function create(employeeId, data) {
  const db = getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO addresses (
      id, employee_id, street_address, city, state, postal_code, country, address_type, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    employeeId,
    data.streetAddress,
    data.city,
    data.state,
    data.postalCode,
    data.country || 'USA',
    data.addressType || 'Current',
    now,
    now
  );
  
  return findById(id);
}

/**
 * Update address by ID
 * @param {string} id - Address UUID
 * @param {Object} data - Update data
 * @returns {Object|null} Updated address or null
 */
function update(id, data) {
  const db = getDatabase();
  const existing = findById(id);
  if (!existing) return null;
  
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    UPDATE addresses SET
      street_address = COALESCE(?, street_address),
      city = COALESCE(?, city),
      state = COALESCE(?, state),
      postal_code = COALESCE(?, postal_code),
      country = COALESCE(?, country),
      address_type = COALESCE(?, address_type),
      updated_at = ?
    WHERE id = ?
  `);
  
  stmt.run(
    data.streetAddress,
    data.city,
    data.state,
    data.postalCode,
    data.country,
    data.addressType,
    now,
    id
  );
  
  return findById(id);
}

/**
 * Delete address by ID
 * @param {string} id - Address UUID
 * @returns {boolean} True if deleted
 */
function remove(id) {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM addresses WHERE id = ?').run(id);
  return result.changes > 0;
}

/**
 * Count addresses for an employee
 * @param {string} employeeId - Employee UUID
 * @returns {number} Address count
 */
function countByEmployeeId(employeeId) {
  const db = getDatabase();
  const result = db.prepare('SELECT COUNT(*) as count FROM addresses WHERE employee_id = ?').get(employeeId);
  return result.count;
}

/**
 * Get unique cities from all addresses
 * @returns {Array} List of unique cities
 */
function getUniqueCities() {
  const db = getDatabase();
  const cities = db.prepare('SELECT DISTINCT city FROM addresses ORDER BY city').all();
  return cities.map(c => c.city);
}

/**
 * Get unique states from all addresses
 * @returns {Array} List of unique states
 */
function getUniqueStates() {
  const db = getDatabase();
  const states = db.prepare('SELECT DISTINCT state FROM addresses ORDER BY state').all();
  return states.map(s => s.state);
}

/**
 * Get unique countries from all addresses
 * @returns {Array} List of unique countries
 */
function getUniqueCountries() {
  const db = getDatabase();
  const countries = db.prepare('SELECT DISTINCT country FROM addresses ORDER BY country').all();
  return countries.map(c => c.country);
}

/**
 * Transform database row to API format
 * @param {Object} row - Database row
 * @returns {Object} Transformed address
 */
function transformAddress(row) {
  return {
    id: row.id,
    employeeId: row.employee_id,
    streetAddress: row.street_address,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
    addressType: row.address_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = {
  findByEmployeeId,
  findById,
  create,
  update,
  remove,
  countByEmployeeId,
  getUniqueCities,
  getUniqueStates,
  getUniqueCountries,
  transformAddress
};