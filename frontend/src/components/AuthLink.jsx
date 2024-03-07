import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AuthLink = ({ link, text }) => {
  return (
    <Container>
      <Link to={link}>
        <p>{text}</p>
      </Link>
    </Container>
  );
};

export default AuthLink;
const Container = styled.div`
  display: grid;
  place-items: center;
  margin: 3em 0;
`;
