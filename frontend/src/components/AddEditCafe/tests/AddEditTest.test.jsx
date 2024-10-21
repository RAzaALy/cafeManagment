// src/components/__tests__/AddEditCafe.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEditCafe from '../index'; // Adjust this if needed based on your structure
import Modal from '../../elements/Modal'; // Adjusted the path to reflect the correct structure
// import '@testing-library/jest-dom/extend-expect'; // Uncomment for better assertions

// Mock the Modal component
jest.mock('../../elements/Modal', () => ({ isOpen, title, onClose, children }) => (
    isOpen ? (
        <div role="dialog">
            <h1>{title}</h1>
            <button onClick={onClose}>Close</button>
            {children}
        </div>
    ) : null
));

describe('AddEditCafe', () => {
    const mockOnSubmitSuccess = jest.fn();

    const setup = (props) => {
        render(<AddEditCafe {...props} onSubmitSuccess={mockOnSubmitSuccess} />);
    };

    afterEach(() => {
        jest.clearAllMocks(); // Clear any mocked function calls after each test
    });

    test('renders Add Cafe modal', () => {
        setup({ isOpen: true, isEditMode: false });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Add Cafe/i)).toBeInTheDocument();
    });

    test('renders Edit Cafe modal and populates fields', () => {
        const cafeData = {
            name: 'Coffee House',
            description: 'A cozy place for coffee',
            location: 'Downtown',
            logo: 'http://example.com/logo.jpg',
        };

        setup({ isOpen: true, isEditMode: true, cafeData });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Edit Cafe/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Name/i).value).toBe(cafeData.name);
        expect(screen.getByLabelText(/Description/i).value).toBe(cafeData.description);
        expect(screen.getByLabelText(/Location/i).value).toBe(cafeData.location);
    });

    test('updates state on input change', () => {
        setup({ isOpen: true, isEditMode: false });

        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: 'New Cafe' } });
        expect(nameInput.value).toBe('New Cafe');
    });

    test('submits form with new cafe data', () => {
        setup({ isOpen: true, isEditMode: false });

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Cafe' } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A new cafe' } });
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Somewhere' } });
        fireEvent.click(screen.getByText(/Add Cafe/i));

        expect(mockOnSubmitSuccess).toHaveBeenCalledTimes(1);
    });

    test('submits form with edited cafe data', () => {
        const cafeData = {
            name: 'Coffee House',
            description: 'A cozy place for coffee',
            location: 'Downtown',
            logo: 'http://example.com/logo.jpg',
        };

        setup({ isOpen: true, isEditMode: true, cafeData });

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Updated Cafe' } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Updated description' } });
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'New Location' } });
        fireEvent.click(screen.getByText(/Update Cafe/i));

        expect(mockOnSubmitSuccess).toHaveBeenCalledTimes(1);
    });

    test('disables submit button if required fields are empty', () => {
        setup({ isOpen: true, isEditMode: false });

        const submitButton = screen.getByText(/Add Cafe/i);
        expect(submitButton).toBeDisabled();
        
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Cafe' } });
        expect(submitButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A new cafe' } });
        expect(submitButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Somewhere' } });
        expect(submitButton).toBeEnabled();
    });
});
