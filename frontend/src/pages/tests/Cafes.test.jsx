// src/pages/Cafe.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Cafe from './Cafe';
import * as cafeServices from '../services/cafeServices';

// Mock the necessary services
jest.mock('../services/cafeServices');

const queryClient = new QueryClient();

describe('Cafe Component', () => {
    beforeEach(() => {
        cafeServices.fetchCafes.mockResolvedValue([{ cafeId: 1, name: 'Cafe One', description: 'Description One', logo: 'logo1.png', employeeCount: 5, location: 'Location One' }]);
        cafeServices.fetchCafesByLocation.mockResolvedValue([{ cafeId: 2, name: 'Cafe Two', description: 'Description Two', logo: 'logo2.png', employeeCount: 3, location: 'Location Two' }]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the Cafe component and displays cafes', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Cafe />
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Cafe's Management/i)).toBeInTheDocument();
        expect(await screen.findByText(/Cafe One/i)).toBeInTheDocument();
    });

    test('adds a new cafe', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Cafe />
            </QueryClientProvider>
        );

        // Mock addCafe
        cafeServices.addCafe.mockResolvedValue({ cafeId: 3, name: 'Cafe Three', description: 'Description Three', logo: 'logo3.png', employeeCount: 2, location: 'Location Three' });

        // Open the modal to add a cafe
        fireEvent.click(screen.getByText(/Add Cafe/i));

        // Fill in the cafe form and submit
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Cafe Three' } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Description Three' } });
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Location Three' } });

        fireEvent.click(screen.getByText(/Add Cafe/i));

        // Verify that the new cafe appears in the grid
        expect(await screen.findByText(/Cafe Three/i)).toBeInTheDocument();
    });

    test('edits an existing cafe', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Cafe />
            </QueryClientProvider>
        );

        // Open the modal to edit a cafe
        fireEvent.click(screen.getByText(/Edit/i)); // Assuming you have an edit button

        // Fill in the cafe form and submit
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Updated Cafe One' } });
        fireEvent.click(screen.getByText(/Update Cafe/i));

        // Verify that the updated cafe appears in the grid
        expect(await screen.findByText(/Updated Cafe One/i)).toBeInTheDocument();
    });

    test('deletes a cafe', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Cafe />
            </QueryClientProvider>
        );

        // Open the delete confirmation dialog
        fireEvent.click(screen.getByText(/Delete/i)); // Assuming you have a delete button

        // Confirm the deletion
        fireEvent.click(screen.getByText(/Yes/i));

        // Verify that the cafe is no longer in the grid
        expect(screen.queryByText(/Cafe One/i)).not.toBeInTheDocument();
    });

    test('searches cafes by location', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Cafe />
            </QueryClientProvider>
        );

        // Type in the search box
        fireEvent.change(screen.getByPlaceholderText(/Search by Location/i), { target: { value: 'Location Two' } });

        // Trigger the search
        await waitFor(() => expect(cafeServices.fetchCafesByLocation).toHaveBeenCalledWith('Location Two'));

        // Verify that the correct cafe appears in the grid
        expect(await screen.findByText(/Cafe Two/i)).toBeInTheDocument();
    });
});
