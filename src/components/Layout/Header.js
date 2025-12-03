import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: #003366;
  padding: 1rem 2rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1rem;
`;

const StyledNavLink = styled(NavLink)`
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  &.active {
    border-bottom: 2px solid #ffcc00;
  }
  &:hover {
    color: #ffcc00;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const Button = styled.button`
  background: transparent;
  border: 1.5px solid #ffcc00;
  border-radius: 4px;
  color: #ffcc00;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  &:hover {
    background-color: #ffcc00;
    color: #003366;
  }
`;

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <HeaderContainer>
      <Title>Result Portal</Title>
      {user ? (
        <NavLinks aria-label="Primary navigation">
          <StyledNavLink to="/dashboard">Dashboard</StyledNavLink>
          <StyledNavLink to="/upload">Upload</StyledNavLink>
          <Button onClick={handleLogout} aria-label="Logout">
            Logout
          </Button>
        </NavLinks>
      ) : (
        <NavLinks>
          <StyledNavLink to="/login">Login</StyledNavLink>
          <StyledNavLink to="/signup">Signup</StyledNavLink>
        </NavLinks>
      )}
    </HeaderContainer>
  );
}

export default Header;
