import React from "react";
import styled from "styled-components";

const AvatarContainer = ({
  ratio = 50,
  src = "user",
  imgWidth = "90%",
  event = null,
}) => {
  return (
    <Container
      className="avatar-container"
      $ratio={ratio}
      $imgWidth={imgWidth}
      onClick={event}
    >
      {/* replace with the user's actual photo */}
      <img src={`/media/${src}.png`} alt="Profile" />
    </Container>
  );
};

export default AvatarContainer;
const Container = styled.div`
  border: 2px solid white;
  width: ${(props) => props.$ratio}px;
  height: ${(props) => props.$ratio}px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;

  & img {
    width: ${(props) => props.$imgWidth};
  }
`;
