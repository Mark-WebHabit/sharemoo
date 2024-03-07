import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Header from "../components/Header";
import AuthLeftbar from "../components/AuthLeftbar";

const AuthLayout = () => {
  return (
    <Container>
      <Header />
      <div className="wrapper">
        <AuthLeftbar />
        <Outlet />
      </div>
    </Container>
  );
};

export default AuthLayout;
const Container = styled.div`
  height: 100%;

  .wrapper {
    padding-top: calc(100vh / 10);
    height: 100%;
    display: grid;
    grid-template-columns: 0.7fr 1fr;
  }
`;
