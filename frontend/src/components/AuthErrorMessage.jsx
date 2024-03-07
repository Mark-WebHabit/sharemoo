import React from "react";
import styled from "styled-components";
const AuthErrorMessage = ({ error }) => {
  return <Container>{error}</Container>;
};

export default AuthErrorMessage;
const Container = styled.p`
  font-size: 0.9rem;
  color: red;
  text-align: center;
  text-transform: capitalize;
  margin: 1em 0;
  margin-top: 4em;
`;
