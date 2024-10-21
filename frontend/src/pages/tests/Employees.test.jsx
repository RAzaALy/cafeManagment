// src/pages/Employees.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Employees from './Employees';
import * as employeeServices from '../services/employeeServices';

// Mock the necessary services
jest.mock('../services/employeeServices');

const queryClient = new QueryClient();

describe('Employees Component', () => {
    beforeEach(() => {
        employeeServices.fetchEmployees.mockResolvedValue([
            { employeeId: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', daysWorked: 20, cafeDetails: { name: 'Cafe One' } },
        ]);
        employeeServices.fetchEmployeesByCafe.mockResolvedValue([
            { employeeId: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', daysWorked: 18, cafeDetails: { name: 'Cafe Two' } },
        ]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the Employees component and displays employees', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Employees />
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Employees/i)).toBeInTheDocument();
        expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    });

    test('adds a new employee', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Employees />
            </QueryClientProvider>
        );

        // Mock addEmployee
        employeeServices.addEmployee.mockResolvedValue({
            employeeId: 3,
            name: 'Alice Brown',
            email: 'alice@example.com',
            phone: '555-555-5555',
            daysWorked: 15,
            cafeDetails: { name: 'Cafe One' },
        });

        // Open the modal to add an employee
        fireEvent.click(screen.getByText(/Add Employee/i));

        // Fill in the employee form and submit
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Alice Brown' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '555-555-5555' } });
        fireEvent.change(screen.getByLabelText(/Days Worked/i), { target: { value: '15' } });

        fireEvent.click(screen.getByText(/Add Employee/i));

        // Verify that the new employee appears in the grid
        expect(await screen.findByText(/Alice Brown/i)).toBeInTheDocument();
    });

    test('edits an existing employee', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Employees />
            </QueryClientProvider>
        );

        // Open the modal to edit an employee
        fireEvent.click(screen.getByText(/Edit/i)); // Assuming you have an edit button

        // Fill in the employee form and submit
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Updated John Doe' } });
        fireEvent.click(screen.getByText(/Update Employee/i));

        // Verify that the updated employee appears in the grid
        expect(await screen.findByText(/Updated John Doe/i)).toBeInTheDocument();
    });

    test('deletes an employee', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Employees />
            </QueryClientProvider>
        );

        // Open the delete confirmation dialog
        fireEvent.click(screen.getByText(/Delete/i)); // Assuming you have a delete button

        // Confirm the deletion
        fireEvent.click(screen.getByText(/Yes/i));

        // Verify that the employee is no longer in the grid
        expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    });

    test('searches employees by cafe', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Employees />
            </QueryClientProvider>
        );

        // Type in the search box
        fireEvent.change(screen.getByPlaceholderText(/Search by Cafe/i), { target: { value: 'Cafe Two' } });

        // Trigger the search
        await waitFor(() => expect(employeeServices.fetchEmployeesByCafe).toHaveBeenCalledWith('Cafe Two'));

        // Verify that the correct employee appears in the grid
        expect(await screen.findByText(/Jane Smith/i)).toBeInTheDocument();
    });
});
