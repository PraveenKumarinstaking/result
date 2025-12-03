import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../api/api';

jest.mock('../api/api');

const mockResults = {
  results: [
    {
      id: '1',
      studentName: 'Alice Smith',
      subject: 'Mathematics',
      score: 92,
      date: '2023-05-01T00:00:00.000Z'
    },
    {
      id: '2',
      studentName: 'Bob Johnson',
      subject: 'Physics',
      score: 85,
      date: '2023-04-30T00:00:00.000Z'
    }
  ]
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    api.fetchResults.mockClear();
  });

  function renderDashboard() {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  }

  test('renders and fetches results', async () => {
    api.fetchResults.mockResolvedValueOnce(mockResults);
    renderDashboard();

    expect(screen.getByText(/loading results/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.fetchResults).toHaveBeenCalled();
      expect(screen.getByText(/alice smith/i)).toBeInTheDocument();
      expect(screen.getByText(/mathematics/i)).toBeInTheDocument();
    });
  });

  test('shows error message on fetch failure', async () => {
    api.fetchResults.mockRejectedValueOnce(new Error('Network error'));
    renderDashboard();

    expect(screen.getByText(/loading results/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/network error/i);
    });
  });

  test('filters results by subject', async () => {
    api.fetchResults.mockResolvedValue(mockResults);
    renderDashboard();

    await waitFor(() => expect(api.fetchResults).toHaveBeenCalled());

    const subjectSelect = screen.getByLabelText(/filter by subject/i);
    fireEvent.change(subjectSelect, { target: { value: 'Physics' } });

    await waitFor(() => {
      expect(api.fetchResults).toHaveBeenCalledWith(expect.objectContaining({ subject: 'Physics' }));
    });
  });

  test('searches results by student name', async () => {
    api.fetchResults.mockResolvedValue(mockResults);
    renderDashboard();

    await waitFor(() => expect(api.fetchResults).toHaveBeenCalled());

    const searchInput = screen.getByRole('searchbox', { name: /search by student name/i });
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    await waitFor(() => {
      expect(api.fetchResults).toHaveBeenCalledWith(expect.objectContaining({ search: 'Alice' }));
    });
  });
});
