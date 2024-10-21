// tests/employeeController.test.js

const request = require('supertest');
const app = require('../app'); // Your Express app
const Employee = require('../models/employee');
const EmployeeCafeAssignment = require('../models/employeeCafeAssignment');

jest.mock('../models/employee');
jest.mock('../models/employeeCafeAssignment');

describe('Employee Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls and instances after each test
  });

  it('should fetch all employees', async () => {
    Employee.aggregate.mockResolvedValue([{ employeeId: '1', name: 'John Doe' }]);

    const response = await request(app).get('/api/employees');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ employeeId: '1', name: 'John Doe' }]);
  });

  it('should create a new employee', async () => {
    const employeeData = { name: 'Jane Doe', email: 'jane@example.com', phone: '1234567890', gender: 'Female' };
    Employee.prototype.save = jest.fn().mockResolvedValue(employeeData);

    const response = await request(app)
      .post('/api/employees')
      .send({ ...employeeData, cafeId: 'cafe-id' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(employeeData);
  });

  it('should update an existing employee', async () => {
    const employeeData = { employeeId: '1', name: 'Updated Employee' };
    Employee.findOne.mockResolvedValue(employeeData);
    Employee.prototype.save = jest.fn().mockResolvedValue(employeeData);

    const response = await request(app)
      .put('/api/employees/1')
      .send({ name: 'Updated Employee' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(employeeData);
  });

  it('should delete an employee', async () => {
    const employeeData = { employeeId: '1' };
    Employee.findOneAndDelete.mockResolvedValue(employeeData);

    const response = await request(app).delete('/api/employees/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Employee deleted' });
  });

  it('should return an error when employee not found', async () => {
    Employee.findOneAndDelete.mockResolvedValue(null);

    const response = await request(app).delete('/api/employees/non-existent-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Employee not found' });
  });
});
