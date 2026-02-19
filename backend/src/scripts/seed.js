const { initDatabase, initSchema, getDatabase, closeDatabase } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

// Initialize database
initDatabase();
initSchema();

const db = getDatabase();

// Sample data
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Product', 'Design'];
const positions = {
  Engineering: ['Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Engineering Manager', 'DevOps Engineer'],
  Marketing: ['Marketing Specialist', 'Marketing Manager', 'Content Writer', 'SEO Specialist', 'Brand Manager'],
  Sales: ['Sales Representative', 'Sales Manager', 'Account Executive', 'Business Development', 'Sales Director'],
  HR: ['HR Specialist', 'HR Manager', 'Recruiter', 'HR Director', 'Benefits Coordinator'],
  Finance: ['Financial Analyst', 'Accountant', 'Finance Manager', 'Controller', 'CFO'],
  Operations: ['Operations Analyst', 'Operations Manager', 'Project Manager', 'COO', 'Logistics Coordinator'],
  Product: ['Product Manager', 'Product Owner', 'Product Analyst', 'VP Product', 'Associate Product Manager'],
  Design: ['UI Designer', 'UX Designer', 'Design Lead', 'Creative Director', 'Graphic Designer']
};

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
  'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

const cities = [
  { city: 'San Francisco', state: 'CA', postalCode: '94102' },
  { city: 'New York', state: 'NY', postalCode: '10001' },
  { city: 'Los Angeles', state: 'CA', postalCode: '90001' },
  { city: 'Chicago', state: 'IL', postalCode: '60601' },
  { city: 'Houston', state: 'TX', postalCode: '77001' },
  { city: 'Phoenix', state: 'AZ', postalCode: '85001' },
  { city: 'Seattle', state: 'WA', postalCode: '98101' },
  { city: 'Denver', state: 'CO', postalCode: '80201' },
  { city: 'Boston', state: 'MA', postalCode: '02101' },
  { city: 'Austin', state: 'TX', postalCode: '73301' }
];

const streetNames = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Park Ave', 'First St', 'Second Ave', 'Third Blvd'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateEmployees(count) {
  const employees = [];
  const usedEmails = new Set();
  
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    
    // Ensure unique email
    let emailCounter = 1;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailCounter}@company.com`;
      emailCounter++;
    }
    usedEmails.add(email);
    
    const department = randomElement(departments);
    const position = randomElement(positions[department]);
    
    const statuses = ['Active', 'Active', 'Active', 'Active', 'On Leave', 'Inactive']; // Weighted toward Active
    const types = ['Full-time', 'Full-time', 'Full-time', 'Part-time', 'Contract', 'Intern'];
    
    employees.push({
      id: uuidv4(),
      employeeId: `EMP-${String(i + 1).padStart(6, '0')}`,
      firstName,
      lastName,
      email,
      phone: `555-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
      department,
      position,
      employmentStatus: randomElement(statuses),
      employmentType: randomElement(types),
      hireDate: randomDate(new Date('2015-01-01'), new Date()),
      managerId: null
    });
  }
  
  // Assign managers (some employees will be managers)
  const managers = employees.filter((_, i) => i < Math.floor(count * 0.2)); // Top 20% are potential managers
  
  employees.forEach((emp, i) => {
    if (i >= Math.floor(count * 0.2)) { // Don't assign managers to top 20%
      const potentialManagers = managers.filter(m => m.department === emp.department);
      if (potentialManagers.length > 0) {
        emp.managerId = randomElement(potentialManagers).id;
      }
    }
  });
  
  return employees;
}

function generateAddresses(employees) {
  const addresses = [];
  
  employees.forEach(emp => {
    // Each employee gets at least one address
    const location = randomElement(cities);
    addresses.push({
      id: uuidv4(),
      employeeId: emp.id,
      streetAddress: `${Math.floor(Math.random() * 9999) + 1} ${randomElement(streetNames)}`,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      country: 'USA',
      addressType: 'Current'
    });
    
    // 30% chance of having a permanent address too
    if (Math.random() < 0.3) {
      const permLocation = randomElement(cities);
      addresses.push({
        id: uuidv4(),
        employeeId: emp.id,
        streetAddress: `${Math.floor(Math.random() * 9999) + 1} ${randomElement(streetNames)}`,
        city: permLocation.city,
        state: permLocation.state,
        postalCode: permLocation.postalCode,
        country: 'USA',
        addressType: 'Permanent'
      });
    }
  });
  
  return addresses;
}

// Clear existing data
console.log('Clearing existing data...');
db.exec('DELETE FROM addresses');
db.exec('DELETE FROM employees');

// Generate and insert data
const employeeCount = 50;
console.log(`Generating ${employeeCount} employees...`);

const employees = generateEmployees(employeeCount);
const addresses = generateAddresses(employees);

// Insert employees
const insertEmployee = db.prepare(`
  INSERT INTO employees (id, employee_id, first_name, last_name, email, phone, department, position, 
    employment_status, employment_type, hire_date, manager_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

const insertManyEmployees = db.transaction((emps) => {
  for (const emp of emps) {
    insertEmployee.run(
      emp.id, emp.employeeId, emp.firstName, emp.lastName, emp.email, emp.phone,
      emp.department, emp.position, emp.employmentStatus, emp.employmentType,
      emp.hireDate, emp.managerId
    );
  }
});

console.log('Inserting employees...');
insertManyEmployees(employees);

// Insert addresses
const insertAddress = db.prepare(`
  INSERT INTO addresses (id, employee_id, street_address, city, state, postal_code, country, address_type, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

const insertManyAddresses = db.transaction((addrs) => {
  for (const addr of addrs) {
    insertAddress.run(
      addr.id, addr.employeeId, addr.streetAddress, addr.city, addr.state,
      addr.postalCode, addr.country, addr.addressType
    );
  }
});

console.log('Inserting addresses...');
insertManyAddresses(addresses);

// Summary
const empCount = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
const addrCount = db.prepare('SELECT COUNT(*) as count FROM addresses').get().count;

console.log('\n✅ Seed completed!');
console.log(`   Employees: ${empCount}`);
console.log(`   Addresses: ${addrCount}`);

// Department breakdown
const deptBreakdown = db.prepare('SELECT department, COUNT(*) as count FROM employees GROUP BY department ORDER BY count DESC').all();
console.log('\nDepartment breakdown:');
deptBreakdown.forEach(d => console.log(`   ${d.department}: ${d.count}`));

closeDatabase();