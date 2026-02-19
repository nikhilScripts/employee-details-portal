const request = require('supertest');
const Database = require('better-sqlite3');
const { setDatabase, initSchema, closeDatabase } = require('../../../src/database/init');
const app = require('../../../src/app');

describe('Employee API', () => {
  let db;

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
  });

  const validEmployee = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    department: 'Engineering',
    position: 'Software Engineer',
    hireDate: '2024-01-15',
    employmentStatus: 'Active',
    employmentType: 'Full-time'
  };

  describe('GET /api/employees', () => {
    it('should return empty array when no employees', async () => {
      const res = await request(app)
        .get('/api/employees')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.meta.total).toBe(0);
    });

    it('should return paginated list of employees', async () => {
      // Create test employees
      for (let i = 0; i < 15; i++) {
        await request(app)
          .post('/api/employees')
          .send({ ...validEmployee, email: `emp${i}@test.com` });
      }

      const res = await request(app)
        .get('/api/employees')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(10);
      expect(res.body.meta.total).toBe(15);
      expect(res.body.meta.totalPages).toBe(2);
    });

    it('should filter by department', async () => {
      await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, department: 'Engineering' });

      await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'marketing@test.com', department: 'Marketing' });

      const res = await request(app)
        .get('/api/employees')
        .query({ department: 'Engineering' })
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].department).toBe('Engineering');
    });

    it('should search by name', async () => {
      await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, firstName: 'Alice', email: 'alice@test.com' });

      await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, firstName: 'Bob', email: 'bob@test.com' });

      const res = await request(app)
        .get('/api/employees')
        .query({ search: 'Alice' })
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].firstName).toBe('Alice');
    });
  });

  describe('POST /api/employees', () => {
    it('should create employee with valid data', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send(validEmployee)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.employeeId).toMatch(/^EMP-\d{6}$/);
      expect(res.body.data.firstName).toBe('John');
      expect(res.body.data.lastName).toBe('Doe');
      expect(res.body.data.fullName).toBe('John Doe');
    });

    it('should create employee with address', async () => {
      const employeeWithAddress = {
        ...validEmployee,
        addresses: [{
          streetAddress: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102'
        }]
      };

      const res = await request(app)
        .post('/api/employees')
        .send(employeeWithAddress)
        .expect(201);

      expect(res.body.data.addresses).toHaveLength(1);
      expect(res.body.data.addresses[0].city).toBe('San Francisco');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({ firstName: 'John' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'invalid-email' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate email', async () => {
      await request(app)
        .post('/api/employees')
        .send(validEmployee);

      const res = await request(app)
        .post('/api/employees')
        .send(validEmployee)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('DUPLICATE_EMAIL');
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return employee by ID', async () => {
      const createRes = await request(app)
        .post('/api/employees')
        .send(validEmployee);

      const res = await request(app)
        .get(`/api/employees/${createRes.body.data.id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createRes.body.data.id);
      expect(res.body.data.firstName).toBe('John');
    });

    it('should include manager info if exists', async () => {
      const managerRes = await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'manager@test.com' });

      const empRes = await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'employee@test.com', managerId: managerRes.body.data.id });

      const res = await request(app)
        .get(`/api/employees/${empRes.body.data.id}`)
        .expect(200);

      expect(res.body.data.manager).toBeDefined();
      expect(res.body.data.manager.id).toBe(managerRes.body.data.id);
    });

    it('should include direct reports', async () => {
      const managerRes = await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'manager@test.com' });

      await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'emp1@test.com', managerId: managerRes.body.data.id });

      await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'emp2@test.com', managerId: managerRes.body.data.id });

      const res = await request(app)
        .get(`/api/employees/${managerRes.body.data.id}`)
        .expect(200);

      expect(res.body.data.directReports).toHaveLength(2);
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app)
        .get('/api/employees/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 400 for invalid UUID', async () => {
      const res = await request(app)
        .get('/api/employees/invalid-id')
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update employee', async () => {
      const createRes = await request(app)
        .post('/api/employees')
        .send(validEmployee);

      const res = await request(app)
        .put(`/api/employees/${createRes.body.data.id}`)
        .send({ firstName: 'Jane', position: 'Senior Engineer' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('Jane');
      expect(res.body.data.position).toBe('Senior Engineer');
      expect(res.body.data.lastName).toBe('Doe'); // Unchanged
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app)
        .put('/api/employees/00000000-0000-0000-0000-000000000000')
        .send({ firstName: 'Test' })
        .expect(404);

      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 409 for duplicate email', async () => {
      await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'existing@test.com' });

      const createRes = await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'new@test.com' });

      const res = await request(app)
        .put(`/api/employees/${createRes.body.data.id}`)
        .send({ email: 'existing@test.com' })
        .expect(409);

      expect(res.body.error.code).toBe('DUPLICATE_EMAIL');
    });

    it('should prevent self as manager', async () => {
      const createRes = await request(app)
        .post('/api/employees')
        .send(validEmployee);

      const res = await request(app)
        .put(`/api/employees/${createRes.body.data.id}`)
        .send({ managerId: createRes.body.data.id })
        .expect(400);

      expect(res.body.error.code).toBe('INVALID_MANAGER');
    });

    it('should prevent circular manager reference', async () => {
      const emp1Res = await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'emp1@test.com' });

      const emp2Res = await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'emp2@test.com', managerId: emp1Res.body.data.id });

      const res = await request(app)
        .put(`/api/employees/${emp1Res.body.data.id}`)
        .send({ managerId: emp2Res.body.data.id })
        .expect(400);

      expect(res.body.error.code).toBe('CIRCULAR_REFERENCE');
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete employee', async () => {
      const createRes = await request(app)
        .post('/api/employees')
        .send(validEmployee);

      const res = await request(app)
        .delete(`/api/employees/${createRes.body.data.id}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify deleted
      await request(app)
        .get(`/api/employees/${createRes.body.data.id}`)
        .expect(404);
    });

    it('should cascade delete addresses', async () => {
      const createRes = await request(app)
        .post('/api/employees')
        .send({
          ...validEmployee,
          addresses: [{
            streetAddress: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102'
          }]
        });

      await request(app)
        .delete(`/api/employees/${createRes.body.data.id}`)
        .expect(200);

      const addressesRes = await request(app)
        .get(`/api/employees/${createRes.body.data.id}/addresses`);

      // Should return 404 since employee doesn't exist
      expect(addressesRes.status).toBe(404);
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app)
        .delete('/api/employees/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/employees/:id/addresses', () => {
    it('should return addresses for employee', async () => {
      const createRes = await request(app)
        .post('/api/employees')
        .send(validEmployee);

      await request(app)
        .post(`/api/employees/${createRes.body.data.id}/addresses`)
        .send({
          streetAddress: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102'
        });

      const res = await request(app)
        .get(`/api/employees/${createRes.body.data.id}/addresses`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/employees/:id/addresses', () => {
    it('should add address to employee', async () => {
      const createRes = await request(app)
        .post('/api/employees')
        .send(validEmployee);

      const res = await request(app)
        .post(`/api/employees/${createRes.body.data.id}/addresses`)
        .send({
          streetAddress: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.city).toBe('San Francisco');
    });

    it('should return 400 for missing required fields', async () => {
      const createRes = await request(app)
        .post('/api/employees')
        .send(validEmployee);

      const res = await request(app)
        .post(`/api/employees/${createRes.body.data.id}/addresses`)
        .send({ city: 'San Francisco' })
        .expect(400);

      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/employees/managers', () => {
    it('should return list of potential managers', async () => {
      await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'emp1@test.com' });

      await request(app)
        .post('/api/employees')
        .send({ ...validEmployee, email: 'emp2@test.com' });

      const res = await request(app)
        .get('/api/employees/managers')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});