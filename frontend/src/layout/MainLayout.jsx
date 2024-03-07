import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Header from "../components/Header";
import HomeLeftbar from "../components/HomeLeftbar";
import HomeRightbar from "../components/HomeRightbar";
import GridBodyLayout from "./GridBodyLayout";
import HomePage from "../views/HomePage";
import Profile from "../views/Profile";

const MainLayout = () => {
  return (
    <Container>
      <Header />
      <div className="wrapper">
        <HomeLeftbar />
        <GridBodyLayout>
          <HomePage />
        </GridBodyLayout>
        <HomeRightbar />
      </div>
    </Container>
  );
};
export default MainLayout;

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  & .wrapper {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr;
    place-items: center;
    padding-top: calc(100vh / 10);
  }
`;
