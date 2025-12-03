import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'result_portal_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Persist user to localStorage
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  async function login(email, password) {
    setLoading(true);
    try {
      // Simulate API login call
      // Replace with real API call here
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      // For demo, accept any email/password
      const loggedInUser = { email, name: 'Demo User', token: 'fake-jwt-token' };
      setUser(loggedInUser);
      setLoading(false);
      return loggedInUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  async function signup(email, password) {
    setLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      // Simulate signup API call - replace with real API call
      const newUser = { email, name: 'New User', token: 'fake-jwt-token' };
      setUser(newUser);
      setLoading(false);
      return newUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
