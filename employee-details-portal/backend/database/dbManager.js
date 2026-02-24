const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Database Manager for Employee Data
class DatabaseManager {
  constructor() {
    this.data = null;
  }

  // Load database from file
  async load() {
    try {
      const fileContent = await fs.readFile(DB_PATH, 'utf8');
      this.data = JSON.parse(fileContent);
      return this.data;
    } catch (error) {
      console.error('Error loading database:', error);
      // Initialize with empty data if file doesn't exist
      this.data = { employees: [], nextId: 1 };
      await this.save();
      return this.data;
    }
  }

  // Save database to file
  async save() {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(this.data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error saving database:', error);
      throw error;
    }
  }

  // Get all employees
  async getAllEmployees() {
    if (!this.data) await this.load();
    return this.data.employees;
  }

  // Get employee by ID
  async getEmployeeById(id) {
    if (!this.data) await this.load();
    return this.data.employees.find(emp => emp.id === id);
  }

  // Create new employee
  async createEmployee(employeeData) {
    if (!this.data) await this.load();
    
    const newEmployee = {
      id: this.data.nextId,
      ...employeeData,
      joinDate: employeeData.joinDate || new Date().toISOString().split('T')[0]
    };
    
    this.data.employees.push(newEmployee);
    this.data.nextId++;
    
    await this.save();
    return newEmployee;
  }

  // Update employee
  async updateEmployee(id, updates) {
    if (!this.data) await this.load();
    
    const index = this.data.employees.findIndex(emp => emp.id === id);
    if (index === -1) return null;
    
    this.data.employees[index] = {
      ...this.data.employees[index],
      ...updates,
      id: id // Ensure ID doesn't change
    };
    
    await this.save();
    return this.data.employees[index];
  }

  // Delete employee
  async deleteEmployee(id) {
    if (!this.data) await this.load();
    
    const index = this.data.employees.findIndex(emp => emp.id === id);
    if (index === -1) return null;
    
    const deletedEmployee = this.data.employees.splice(index, 1)[0];
    await this.save();
    return deletedEmployee;
  }

  // Check if email exists
  async emailExists(email, excludeId = null) {
    if (!this.data) await this.load();
    return this.data.employees.some(emp => 
      emp.email === email && emp.id !== excludeId
    );
  }
}

// Export singleton instance
module.exports = new DatabaseManager();