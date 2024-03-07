import React from "react";
import styled from "styled-components";

// components
import AddPost from "../components/AddPost";

const HomePage = () => {
  return (
    <Container>
      <AddPost />
    </Container>
  );
};

export default HomePage;

const Container = styled.div``;
