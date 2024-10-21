// src/services/__tests__/employeeServices.test.js
import axiosInstance from '../api/axiosInstance';
import {
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    fetchEmployeesByCafe,
} from '../employeeServices';
import AxiosMockAdapter from 'axios-mock-adapter';

const mockAxios = new AxiosMockAdapter(axiosInstance);

describe('Employee Services', () => {
    afterEach(() => {
        mockAxios.reset(); // Reset the mock adapter after each test
    });

    test('fetchEmployees should return list of employees', async () => {
        const employees = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
        mockAxios.onGet('/employee').reply(200, employees);

        const result = await fetchEmployees();
        expect(result).toEqual(employees);
    });

    test('addEmployee should create a new employee', async () => {
        const newEmployee = { name: 'New Employee', email: 'new@example.com' };
        const createdEmployee = { id: 3, ...newEmployee };
        mockAxios.onPost('/employee', newEmployee).reply(201, createdEmployee);

        const result = await addEmployee(newEmployee);
        expect(result).toEqual(createdEmployee);
    });

    test('updateEmployee should update an existing employee', async () => {
        const employeeId = 1;
        const updatedEmployeeData = { name: 'Updated Employee' };
        const updatedEmployee = { id: employeeId, ...updatedEmployeeData };
        mockAxios.onPut(`/employee/${employeeId}`, updatedEmployeeData).reply(200, updatedEmployee);

        const result = await updateEmployee(employeeId, updatedEmployeeData);
        expect(result).toEqual(updatedEmployee);
    });

    test('deleteEmployee should remove an employee', async () => {
        const employeeId = 1;
        mockAxios.onDelete(`/employee/${employeeId}`).reply(204);

        await expect(deleteEmployee(employeeId)).resolves.not.toThrow();
    });

    test('fetchEmployeesByCafe should return employees by cafe', async () => {
        const cafe = 'Cafe 1';
        const employees = [{ id: 1, name: 'John Doe', cafe: cafe }];
        mockAxios.onGet(`/employee/?cafeName=${cafe}`).reply(200, employees);

        const result = await fetchEmployeesByCafe(cafe);
        expect(result).toEqual(employees);
    });
});
