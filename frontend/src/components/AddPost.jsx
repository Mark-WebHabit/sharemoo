import React from "react";
import styled from "styled-components";
const AddPost = () => {
  return (
    <Container>
      <div className="avatar-container">
        <img src="/media/user.png" alt="Profile" />
      </div>
      <div className="post-bar">
        <p>Share something...</p>
      </div>
      <img src="/media/photo.png" alt="Upload Photo" className="add-photo" />
    </Container>
  );
};

export default AddPost;
const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background: var(--gray);
  border-radius: 0.5em;
  margin-top: 0.5em;
  padding: 0.5em 1em;

  & .avatar-container {
    border: 2px solid white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    cursor: pointer;

    & img {
      width: 90%;
    }
  }

  & .post-bar {
    flex: 1;
    border-radius: 1em;
    margin: 0 1em;
    background: var(--darkbody);
    & p {
      padding: 0.5em 2em;
    }
  }

  & .add-photo {
    width: 50px;
    cursor: pointer;
  }
`;
