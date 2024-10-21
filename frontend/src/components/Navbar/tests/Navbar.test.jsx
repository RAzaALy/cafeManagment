// src/components/Navbar.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component', () => {
    test('renders the navbar with links', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText(/Cafe's Management/i)).toBeInTheDocument();
        expect(screen.getByText(/Cafes/i)).toBeInTheDocument();
        expect(screen.getByText(/Employees/i)).toBeInTheDocument();
    });

    test('highlights the active link based on the current route', () => {
        render(
            <MemoryRouter initialEntries={['/cafes']}>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText(/Cafes/i)).toHaveClass('bg-gray-700');
        expect(screen.getByText(/Employees/i)).not.toHaveClass('bg-gray-700');

        render(
            <MemoryRouter initialEntries={['/employees']}>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText(/Employees/i)).toHaveClass('bg-gray-700');
        expect(screen.getByText(/Cafes/i)).not.toHaveClass('bg-gray-700');
    });
});
