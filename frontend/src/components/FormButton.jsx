import React from "react";
import styled from "styled-components";

const FormButton = ({ text, event, padding = 0.7 }) => {
  return (
    <Button onClick={event} style={{ padding: `${padding}rem` }}>
      {text}
    </Button>
  );
};

export default FormButton;
const Button = styled.button`
  width: 60%;
  background: var(--gray);
  font-size: 1.1rem;
  margin: 1em 0;
`;
