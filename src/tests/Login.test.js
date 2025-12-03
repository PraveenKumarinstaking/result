import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockUser = null;

  function renderLogin() {
    render(
      <AuthContext.Provider value={{ user: mockUser, login: mockLogin, loading: false }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  }

  beforeEach(() => {
    mockLogin.mockReset();
  });

  test('renders login form inputs and button', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/email and password are required/i);
  });

  test('calls login function with correct data', async () => {
    mockLogin.mockResolvedValue({ email: 'test@example.com' });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('shows error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid credentials/i);
  });
});
