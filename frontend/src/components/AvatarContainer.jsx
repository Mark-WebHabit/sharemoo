import React from "react";
import styled from "styled-components";

const AvatarContainer = ({
  ratio = 50,
  src = "/media/user.png",
  imgWidth = "90%",
  event = null,
}) => {
  return (
    <Container
      $src={src}
      className="avatar-container"
      $ratio={ratio}
      $imgWidth={imgWidth}
      onClick={event}
    ></Container>
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
  background: url(${(props) => props.$src}) no-repeat center center / cover;
`;
