const Database = require('better-sqlite3');
const { setDatabase, initSchema, closeDatabase } = require('../../../src/database/init');
const addressModel = require('../../../src/models/addressModel');
const employeeModel = require('../../../src/models/employeeModel');

describe('Address Model', () => {
  let db;
  let testEmployee;

  beforeAll(() => {
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    setDatabase(db);
    initSchema();
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    db.exec('DELETE FROM addresses');
    db.exec('DELETE FROM employees');
    
    // Create test employee
    testEmployee = employeeModel.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      department: 'Engineering',
      hireDate: '2024-01-15'
    });
  });

  describe('create', () => {
    it('should create address with required fields', () => {
      const data = {
        streetAddress: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102'
      };

      const address = addressModel.create(testEmployee.id, data);

      expect(address).toBeDefined();
      expect(address.id).toBeDefined();
      expect(address.employeeId).toBe(testEmployee.id);
      expect(address.streetAddress).toBe('123 Main St');
      expect(address.city).toBe('San Francisco');
      expect(address.state).toBe('CA');
      expect(address.postalCode).toBe('94102');
      expect(address.country).toBe('USA');
      expect(address.addressType).toBe('Current');
    });

    it('should create address with all fields', () => {
      const data = {
        streetAddress: '456 Oak Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        addressType: 'Permanent'
      };

      const address = addressModel.create(testEmployee.id, data);

      expect(address.country).toBe('USA');
      expect(address.addressType).toBe('Permanent');
    });
  });

  describe('findById', () => {
    it('should find address by ID', () => {
      const created = addressModel.create(testEmployee.id, {
        streetAddress: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102'
      });

      const found = addressModel.findById(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.streetAddress).toBe('123 Main St');
    });

    it('should return null for non-existent ID', () => {
      const found = addressModel.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findByEmployeeId', () => {
    it('should find all addresses for an employee', () => {
      addressModel.create(testEmployee.id, {
        streetAddress: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102',
        addressType: 'Current'
      });

      addressModel.create(testEmployee.id, {
        streetAddress: '456 Oak Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        addressType: 'Permanent'
      });

      const addresses = addressModel.findByEmployeeId(testEmployee.id);

      expect(addresses).toHaveLength(2);
    });

    it('should return empty array for employee with no addresses', () => {
      const addresses = addressModel.findByEmployeeId(testEmployee.id);
      expect(addresses).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update address fields', () => {
      const created = addressModel.create(testEmployee.id, {
        streetAddress: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102'
      });

      const updated = addressModel.update(created.id, {
        streetAddress: '789 New St',
        city: 'Los Angeles'
      });

      expect(updated.streetAddress).toBe('789 New St');
      expect(updated.city).toBe('Los Angeles');
      expect(updated.state).toBe('CA'); // Unchanged
    });

    it('should return null for non-existent ID', () => {
      const updated = addressModel.update('non-existent-id', { city: 'Test' });
      expect(updated).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete address', () => {
      const created = addressModel.create(testEmployee.id, {
        streetAddress: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102'
      });

      const result = addressModel.remove(created.id);

      expect(result).toBe(true);
      expect(addressModel.findById(created.id)).toBeNull();
    });

    it('should return false for non-existent ID', () => {
      const result = addressModel.remove('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('countByEmployeeId', () => {
    it('should return correct count', () => {
      addressModel.create(testEmployee.id, {
        streetAddress: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102'
      });

      addressModel.create(testEmployee.id, {
        streetAddress: '456 Oak Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10001'
      });

      const count = addressModel.countByEmployeeId(testEmployee.id);

      expect(count).toBe(2);
    });

    it('should return 0 for employee with no addresses', () => {
      const count = addressModel.countByEmployeeId(testEmployee.id);
      expect(count).toBe(0);
    });
  });

  describe('getUniqueCities', () => {
    it('should return unique cities', () => {
      addressModel.create(testEmployee.id, {
        streetAddress: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102'
      });

      const emp2 = employeeModel.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      addressModel.create(emp2.id, {
        streetAddress: '456 Oak Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10001'
      });

      addressModel.create(emp2.id, {
        streetAddress: '789 Elm St',
        city: 'San Francisco', // Duplicate city
        state: 'CA',
        postalCode: '94103'
      });

      const cities = addressModel.getUniqueCities();

      expect(cities).toHaveLength(2);
      expect(cities).toContain('San Francisco');
      expect(cities).toContain('New York');
    });
  });

  describe('getUniqueStates', () => {
    it('should return unique states', () => {
      addressModel.create(testEmployee.id, {
        streetAddress: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102'
      });

      const emp2 = employeeModel.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      addressModel.create(emp2.id, {
        streetAddress: '456 Oak Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10001'
      });

      const states = addressModel.getUniqueStates();

      expect(states).toHaveLength(2);
      expect(states).toContain('CA');
      expect(states).toContain('NY');
    });
  });

  describe('transformAddress', () => {
    it('should transform database row to API format', () => {
      const row = {
        id: 'test-id',
        employee_id: 'emp-id',
        street_address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94102',
        country: 'USA',
        address_type: 'Current',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      };

      const transformed = addressModel.transformAddress(row);

      expect(transformed.id).toBe('test-id');
      expect(transformed.employeeId).toBe('emp-id');
      expect(transformed.streetAddress).toBe('123 Main St');
      expect(transformed.postalCode).toBe('94102');
      expect(transformed.addressType).toBe('Current');
    });
  });

  describe('cascade delete', () => {
    it('should delete addresses when employee is deleted', () => {
      addressModel.create(testEmployee.id, {
        streetAddress: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102'
      });

      addressModel.create(testEmployee.id, {
        streetAddress: '456 Oak Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10001'
      });

      expect(addressModel.countByEmployeeId(testEmployee.id)).toBe(2);

      employeeModel.remove(testEmployee.id);

      expect(addressModel.countByEmployeeId(testEmployee.id)).toBe(0);
    });
  });
});