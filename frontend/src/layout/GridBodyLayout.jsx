import React from "react";
import styled from "styled-components";

const GridBodyLayout = ({ children }) => {
  return <Container>{children}</Container>;
};

export default GridBodyLayout;

const Container = styled.main`
  width: 50%;
  max-width: 50%;
  height: 100%;
  display: flex;
  margin: 0 auto;

  & > div {
    flex: 1;
  }
`;
