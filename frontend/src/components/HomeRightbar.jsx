import React from "react";
import styled from "styled-components";

// svgs
import HomeGroup from "../assets/svgs/HomeGroup";
import HomeSaved from "../assets/svgs/HomeSaved";
import HomeOtherSvg from "../assets/svgs/HomeOtherSvg";

const HomeRightbar = () => {
  return (
    <Container>
      <div>
        <HomeGroup />
        <p>Home</p>
      </div>
      <div>
        <HomeSaved />
        <p>Profile</p>
      </div>
      <div>
        <HomeOtherSvg />
        <p>Notification</p>
      </div>
    </Container>
  );
};

export default HomeRightbar;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1em;
  position: fixed;
  height: 95vh
  max-height: 95vh;
  top: calc(100vh / 10);
  right: 0;
  width: 20%;

  & div {
    display: flex;
    align-items: center;
    padding: 0.5em 0 0.5em 2em;
    margin-bottom: 1em;
    cursor: pointer;
    border-radius: 0.6em;

    & svg {
      width: 14%;
      margin-right: 0.5em;
      & g {
        fill: white;
      }
    }

    &:hover {
      background: white;

      & p {
        color: var(--darkbody);
      }

      & svg g {
        fill: var(--darkbody);
      }
    }
  }
`;
