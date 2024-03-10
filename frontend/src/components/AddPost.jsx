import React from "react";
import styled from "styled-components";
import AvatarContainer from "./AvatarContainer";
import { useSelector } from "react-redux";
const AddPost = ({ handleAddPost }) => {
  const { profile } = useSelector((state) => state.user.loggedInUser);
  return (
    // this component enables the user to add post, by clicking a form will prompt
    <Container>
      <AvatarContainer src={profile} />
      <div className="post-bar" onClick={handleAddPost}>
        <p>Share something...</p>
      </div>
      <img
        src="/media/photo.png"
        alt="Upload Photo"
        className="add-photo"
        onClick={handleAddPost}
      />
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
  margin: 0.5em 0 1em 0;
  padding: 0.5em 1em;

 
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
