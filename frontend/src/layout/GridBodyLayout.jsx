import React from "react";
import styled from "styled-components";

const GridBodyLayout = ({ children }) => {
  return <Container>{children}</Container>;
};

export default GridBodyLayout;

const Container = styled.main`
  width: 60%;
  max-width: 60%;
  height: 100%;
  display: flex;
  margin: 0 auto;
  // overflow: hidden;

  & > div {
    flex: 1;
  }
`;
