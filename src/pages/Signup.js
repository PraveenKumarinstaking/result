import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Container = styled.main`
  max-width: 400px;
  margin: 3rem auto 2rem;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fafafa;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: #003366;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.3rem;
`;

const Input = styled.input`
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #999;
  &:focus {
    border-color: #003366;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.6rem;
  background-color: #003366;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #cc0000;
  font-weight: 600;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

const LoginLink = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
  a {
    color: #003366;
    font-weight: 600;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Signup() {
  const { user, signup, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      await signup(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Failed to signup.');
    }
  }

  return (
    <>
      <Header />
      <Container aria-label="Signup form">
        <Title>Sign Up</Title>
        <Form onSubmit={handleSubmit} noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
          <Button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </Form>
        <LoginLink>
          Already have an account? <Link to="/login">Log in</Link>
        </LoginLink>
      </Container>
      <Footer />
    </>
  );
}

export default Signup;
