import React from "react";
import styled from "styled-components";

import { generateRandomId } from "../utilities/generateRandomId.js";

const InputField = ({
  type = "text",
  placeholder = "",
  event = null,
  value = "",
  label = "",
  name = "",
}) => {
  const id = generateRandomId();

  return (
    <Container>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={event}
        value={value}
        maxLength={50}
        id={id}
        name={name}
      />
    </Container>
  );
};

export default InputField;

const Container = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  & label {
    font-size: 1.2rem;
    margin-bottom: 0.5em;
  }
  & input {
    background: var(--gray);
    color: white;
    padding: 0.7em 1em;
    border: none;
    border-radius: 0.5em;

    &:focus {
      outline: none;
    }
  }
`;
