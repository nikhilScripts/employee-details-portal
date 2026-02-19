const Database = require('better-sqlite3');
const { setDatabase, initSchema, getDatabase, closeDatabase } = require('../../../src/database/init');
const employeeModel = require('../../../src/models/employeeModel');

describe('Employee Model', () => {
  let db;

  beforeAll(() => {
    // Use in-memory database for testing
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    setDatabase(db);
    initSchema();
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    // Clear data before each test
    db.exec('DELETE FROM addresses');
    db.exec('DELETE FROM employees');
  });

  describe('generateEmployeeId', () => {
    it('should generate EMP-000001 when no employees exist', () => {
      const id = employeeModel.generateEmployeeId();
      expect(id).toBe('EMP-000001');
    });

    it('should generate sequential IDs', () => {
      // Create first employee
      employeeModel.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const id = employeeModel.generateEmployeeId();
      expect(id).toBe('EMP-000002');
    });

    it('should pad numbers correctly', () => {
      // Insert employees with specific IDs to test padding
      for (let i = 0; i < 5; i++) {
        employeeModel.create({
          firstName: `Test${i}`,
          lastName: 'User',
          email: `test${i}@test.com`,
          department: 'Engineering',
          hireDate: '2024-01-15'
        });
      }

      const id = employeeModel.generateEmployeeId();
      expect(id).toBe('EMP-000006');
    });
  });

  describe('create', () => {
    it('should create employee with required fields', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      };

      const employee = employeeModel.create(data);

      expect(employee).toBeDefined();
      expect(employee.id).toBeDefined();
      expect(employee.employeeId).toMatch(/^EMP-\d{6}$/);
      expect(employee.firstName).toBe('John');
      expect(employee.lastName).toBe('Doe');
      expect(employee.fullName).toBe('John Doe');
      expect(employee.email).toBe('john.doe@test.com');
      expect(employee.department).toBe('Engineering');
      expect(employee.employmentStatus).toBe('Active');
      expect(employee.employmentType).toBe('Full-time');
    });

    it('should create employee with all fields', () => {
      const data = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        phone: '555-123-4567',
        department: 'Marketing',
        position: 'Marketing Manager',
        employmentStatus: 'Active',
        employmentType: 'Full-time',
        hireDate: '2024-01-15'
      };

      const employee = employeeModel.create(data);

      expect(employee.phone).toBe('555-123-4567');
      expect(employee.position).toBe('Marketing Manager');
    });

    it('should set default values for optional fields', () => {
      const data = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      };

      const employee = employeeModel.create(data);

      expect(employee.employmentStatus).toBe('Active');
      expect(employee.employmentType).toBe('Full-time');
      expect(employee.phone).toBeNull();
      expect(employee.position).toBeNull();
      expect(employee.managerId).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find employee by ID', () => {
      const created = employeeModel.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const found = employeeModel.findById(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.firstName).toBe('John');
    });

    it('should return null for non-existent ID', () => {
      const found = employeeModel.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find employee by email', () => {
      employeeModel.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const found = employeeModel.findByEmail('john.doe@test.com');

      expect(found).toBeDefined();
      expect(found.email).toBe('john.doe@test.com');
    });

    it('should return null for non-existent email', () => {
      const found = employeeModel.findByEmail('nonexistent@test.com');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      // Create test employees
      const departments = ['Engineering', 'Marketing', 'Sales'];
      for (let i = 0; i < 15; i++) {
        employeeModel.create({
          firstName: `Employee${i}`,
          lastName: 'Test',
          email: `employee${i}@test.com`,
          department: departments[i % 3],
          hireDate: '2024-01-15',
          employmentStatus: i < 12 ? 'Active' : 'Inactive'
        });
      }
    });

    it('should return paginated results', () => {
      const result = employeeModel.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.meta.total).toBe(15);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(2);
    });

    it('should return second page', () => {
      const result = employeeModel.findAll({ page: 2, limit: 10 });

      expect(result.data).toHaveLength(5);
      expect(result.meta.page).toBe(2);
    });

    it('should filter by department', () => {
      const result = employeeModel.findAll({ department: 'Engineering' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach(emp => {
        expect(emp.department).toBe('Engineering');
      });
    });

    it('should filter by status', () => {
      const result = employeeModel.findAll({ status: 'Inactive' });

      expect(result.data).toHaveLength(3);
      result.data.forEach(emp => {
        expect(emp.employmentStatus).toBe('Inactive');
      });
    });

    it('should search by name', () => {
      const result = employeeModel.findAll({ search: 'Employee1' });

      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('should update employee fields', () => {
      const created = employeeModel.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const updated = employeeModel.update(created.id, {
        firstName: 'Jonathan',
        position: 'Senior Engineer'
      });

      expect(updated.firstName).toBe('Jonathan');
      expect(updated.position).toBe('Senior Engineer');
      expect(updated.lastName).toBe('Doe'); // Unchanged
    });

    it('should return null for non-existent ID', () => {
      const updated = employeeModel.update('non-existent-id', { firstName: 'Test' });
      expect(updated).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete employee', () => {
      const created = employeeModel.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const result = employeeModel.remove(created.id);

      expect(result).toBe(true);
      expect(employeeModel.findById(created.id)).toBeNull();
    });

    it('should return false for non-existent ID', () => {
      const result = employeeModel.remove('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('getDirectReports', () => {
    it('should return direct reports for manager', () => {
      const manager = employeeModel.create({
        firstName: 'Manager',
        lastName: 'Test',
        email: 'manager@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      employeeModel.create({
        firstName: 'Report1',
        lastName: 'Test',
        email: 'report1@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15',
        managerId: manager.id
      });

      employeeModel.create({
        firstName: 'Report2',
        lastName: 'Test',
        email: 'report2@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15',
        managerId: manager.id
      });

      const reports = employeeModel.getDirectReports(manager.id);

      expect(reports).toHaveLength(2);
    });

    it('should return empty array for employee with no reports', () => {
      const employee = employeeModel.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const reports = employeeModel.getDirectReports(employee.id);

      expect(reports).toHaveLength(0);
    });
  });

  describe('hasCircularReference', () => {
    it('should return true when employee is set as their own manager', () => {
      const employee = employeeModel.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const result = employeeModel.hasCircularReference(employee.id, employee.id);

      expect(result).toBe(true);
    });

    it('should return true for circular reference A -> B -> A', () => {
      const empA = employeeModel.create({
        firstName: 'A',
        lastName: 'Test',
        email: 'a@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const empB = employeeModel.create({
        firstName: 'B',
        lastName: 'Test',
        email: 'b@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15',
        managerId: empA.id
      });

      // Check if setting A's manager to B would create a cycle
      const result = employeeModel.hasCircularReference(empA.id, empB.id);

      expect(result).toBe(true);
    });

    it('should return false for valid hierarchy', () => {
      const empA = employeeModel.create({
        firstName: 'A',
        lastName: 'Test',
        email: 'a@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const empB = employeeModel.create({
        firstName: 'B',
        lastName: 'Test',
        email: 'b@test.com',
        department: 'Engineering',
        hireDate: '2024-01-15'
      });

      const result = employeeModel.hasCircularReference(empA.id, empB.id);

      expect(result).toBe(false);
    });
  });

  describe('transformEmployee', () => {
    it('should transform database row to API format', () => {
      const row = {
        id: 'test-id',
        employee_id: 'EMP-000001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@test.com',
        phone: '555-1234',
        department: 'Engineering',
        position: 'Developer',
        employment_status: 'Active',
        employment_type: 'Full-time',
        hire_date: '2024-01-15',
        termination_date: null,
        manager_id: null,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      };

      const transformed = employeeModel.transformEmployee(row);

      expect(transformed.id).toBe('test-id');
      expect(transformed.employeeId).toBe('EMP-000001');
      expect(transformed.firstName).toBe('John');
      expect(transformed.lastName).toBe('Doe');
      expect(transformed.fullName).toBe('John Doe');
      expect(transformed.employmentStatus).toBe('Active');
      expect(transformed.employmentType).toBe('Full-time');
    });
  });
});