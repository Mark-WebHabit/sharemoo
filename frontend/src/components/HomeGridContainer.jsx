import React from "react";
import styled from "styled-components";
import HomeLeftbar from "./HomeLeftbar";
import HomeRightbar from "./HomeRightbar";

// layout
import GridBodyLayout from "../layout/GridBodyLayout";
const HomeGridContainer = () => {
  return (
    <Container>
      <HomeLeftbar />
      <GridBodyLayout />
      <HomeRightbar />
    </Container>
  );
};

export default HomeGridContainer;

const Container = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 15% 1fr 15%;
`;
