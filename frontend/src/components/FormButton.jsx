import React from "react";
import styled from "styled-components";

const FormButton = ({ text }) => {
  return <Button>{text}</Button>;
};

export default FormButton;
const Button = styled.button`
  width: 60%;
  padding: 0.7em;
  background: var(--gray);
  font-size: 1.1rem;
  margin: 1em 0;
`;
