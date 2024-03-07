import React from "react";
import styled from "styled-components";

// components
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";

const HomePage = () => {
  return (
    <Container>
      <AddPost />
      <PostCard />
      <PostCard />
    </Container>
  );
};

export default HomePage;

const Container = styled.div``;
