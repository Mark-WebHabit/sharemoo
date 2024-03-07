import React from "react";
import styled from "styled-components";
const AuthErrorMessage = ({ error = "Error Message" }) => {
  return <Container>{error}</Container>;
};

export default AuthErrorMessage;
const Container = styled.p`
  font-size: 1.1rem;
  color: red;
  text-align: center;
  text-transform: capitalized;
  margin: 1em 0;
  margin-top: 4em;
`;
