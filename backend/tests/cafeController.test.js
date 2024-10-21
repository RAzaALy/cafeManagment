// tests/cafeController.test.js

const request = require('supertest');
const app = require('../app'); // Your Express app
const Cafe = require('../models/cafe');
const EmployeeCafeAssignment = require('../models/employeeCafeAssignment');

jest.mock('../models/cafe');
jest.mock('../models/employeeCafeAssignment');

describe('Cafe Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls and instances after each test
  });

  it('should fetch all cafes', async () => {
    Cafe.find.mockResolvedValue([{ cafeId: '1', name: 'Cafe A', location: 'Location A' }]);
    EmployeeCafeAssignment.aggregate.mockResolvedValue([{ _id: '1', employeeCount: 2 }]);

    const response = await request(app).get('/api/cafes');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ cafeId: '1', name: 'Cafe A', location: 'Location A', employeeCount: 2 }]);
  });

  it('should create a new cafe', async () => {
    const cafeData = { name: 'Cafe B', location: 'Location B', description: 'A new cafe' };
    const mockFile = { id: 'file-id' }; // Mock file upload

    const response = await request(app)
      .post('/api/cafes')
      .field('name', cafeData.name)
      .field('location', cafeData.location)
      .field('description', cafeData.description)
      .attach('file', Buffer.from('test'), { filename: 'test.jpg' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(cafeData));
  });

  it('should update an existing cafe', async () => {
    Cafe.findOneAndUpdate.mockResolvedValue({ cafeId: '1', name: 'Updated Cafe' });

    const response = await request(app)
      .put('/api/cafes/1')
      .send({ name: 'Updated Cafe' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ cafeId: '1', name: 'Updated Cafe' });
  });

  it('should delete a cafe', async () => {
    Cafe.findOneAndDelete.mockResolvedValue({ cafeId: '1' });

    const response = await request(app).delete('/api/cafes/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Cafe and associated employees deleted' });
  });

  it('should return an error when cafe not found', async () => {
    Cafe.findOneAndDelete.mockResolvedValue(null);

    const response = await request(app).delete('/api/cafes/non-existent-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Cafe not found' });
  });
});
