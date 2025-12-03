import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #003366;
  color: #fff;
  text-align: center;
  padding: 1rem 2rem;
  margin-top: auto;
  font-size: 0.9rem;
`;

function Footer() {
  return (
    <FooterContainer role="contentinfo">
      &copy; {new Date().getFullYear()} Result Portal. All rights reserved.
    </FooterContainer>
  );
}

export default Footer;
