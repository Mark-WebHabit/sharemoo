import React, { useEffect } from "react";
import styled from "styled-components";
import { instance } from "../config/instance";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLoggedInUser } from "../features/userSlice";

import Header from "../components/Header";
import HomeLeftbar from "../components/HomeLeftbar";
import HomeRightbar from "../components/HomeRightbar";
import GridBodyLayout from "./GridBodyLayout";
import HomePage from "../views/HomePage";

const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    async function checkTokenValidity() {
      try {
        const response = await instance.get("/auth/check-cookie-token");

        if (!response.data.success) {
          navigate("/auth");
        }
      } catch (error) {
        navigate("/auth");
        // // make a prompt to display this message
        // if (error.response) {
        //   console.log(error.response.data.message);
        // } else {
        //   console.log(error.message);
        // }
      }
    }

    checkTokenValidity();
  }, []);

  return (
    <Container>
      <Header />
      <div className="wrapper">
        <HomeLeftbar />
        <GridBodyLayout>
          <Outlet />
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
