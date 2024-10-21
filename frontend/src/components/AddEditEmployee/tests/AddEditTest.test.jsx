// src/components/__tests__/AddEditEmployee.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEditEmployee from '../AddEditEmployee'; // Adjust this path if needed
import Modal from '../elements/Modal'; // Adjust this path if needed
import { useQuery } from '@tanstack/react-query';

jest.mock('../elements/Modal', () => ({ isOpen, title, onClose, children }) => (
    isOpen ? (
        <div role="dialog">
            <h1>{title}</h1>
            <button onClick={onClose}>Close</button>
            {children}
        </div>
    ) : null
));

// Mock the fetchCafes function to return a static list of cafes
jest.mock('../../services/cafeServices', () => ({
    fetchCafes: jest.fn(() => Promise.resolve([
        { id: '1', name: 'Cafe 1' },
        { id: '2', name: 'Cafe 2' },
    ])),
}));

describe('AddEditEmployee', () => {
    const mockOnSubmitSuccess = jest.fn();
    const handleClose = jest.fn();

    const setup = (props) => {
        render(<AddEditEmployee {...props} onSubmitSuccess={mockOnSubmitSuccess} handleClose={handleClose} />);
    };

    afterEach(() => {
        jest.clearAllMocks(); // Clear any mocked function calls after each test
    });

    test('renders Add Employee modal', () => {
        setup({ isOpen: true, isEditMode: false });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Add Employee/i)).toBeInTheDocument();
    });

    test('renders Edit Employee modal and populates fields', () => {
        const employeeData = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '91234567',
            gender: 'Male',
            cafeId: '1',
        };

        setup({ isOpen: true, isEditMode: true, employeeData });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Edit Employee/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Name/i).value).toBe(employeeData.name);
        expect(screen.getByLabelText(/Email/i).value).toBe(employeeData.email);
        expect(screen.getByLabelText(/Phone/i).value).toBe(employeeData.phone);
    });

    test('updates state on input change', () => {
        setup({ isOpen: true, isEditMode: false });

        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: 'New Employee' } });
        expect(nameInput.value).toBe('New Employee');
    });

    test('submits form with new employee data', () => {
        setup({ isOpen: true, isEditMode: false });

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Employee' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '91234567' } });
        fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'Male' } });
        fireEvent.change(screen.getByLabelText(/Assigned Café/i), { target: { value: '1' } });
        fireEvent.click(screen.getByText(/Add Employee/i));

        expect(mockOnSubmitSuccess).toHaveBeenCalledWith(
            {
                name: 'New Employee',
                email: 'new@example.com',
                phone: '91234567',
                gender: 'Male',
                cafeId: '1',
            },
            false
        );
    });

    test('disables submit button if required fields are empty', () => {
        setup({ isOpen: true, isEditMode: false });

        const submitButton = screen.getByText(/Add Employee/i);
        expect(submitButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Employee' } });
        expect(submitButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@example.com' } });
        expect(submitButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '91234567' } });
        expect(submitButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'Male' } });
        expect(submitButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Assigned Café/i), { target: { value: '1' } });
        expect(submitButton).toBeEnabled();
    });
});
