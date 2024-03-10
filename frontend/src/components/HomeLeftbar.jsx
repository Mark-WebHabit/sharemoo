import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// svgs
import HomeSvg from "../assets/svgs/HomeSvg";
import HomeBell from "../assets/svgs/HomeBell";
import HomeUser from "../assets/svgs/HomeUser";
import HomeFriends from "../assets/svgs/HomeFriends";
import HomeAddFriend from "../assets/svgs/HomeAddFriend";

const HomeLeftbar = () => {
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.user.loggedInUser);
  const handleNavigate = (e) => {
    navigate(e.target.dataset.name);
  };
  return (
    <Container>
      <div data-name="/" onClick={handleNavigate}>
        <HomeSvg />
        <p>Home</p>
      </div>
      <div data-name={`/profile/${id}`} onClick={handleNavigate}>
        <HomeUser />
        <p>Profile</p>
      </div>
      <div>
        <HomeBell />
        <p>Notification</p>
      </div>
      <div>
        <HomeFriends />
        <p>Friends</p>
      </div>
      <div>
        <HomeAddFriend />
        <p>Requests</p>
      </div>
    </Container>
  );
};

export default HomeLeftbar;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1em;
  position: fixed;
  height: 95vh
  max-height: 95vh;
  top: calc(100vh / 10);
  left: 0;
  width: 20%;
  
  & div {
    display: flex;
    align-items: center;
    padding: 0.5em 0 0.5em 2em;
    margin-bottom: 1em;
    cursor: pointer;
    border-radius: 0.6em;

    & svg, & p{
      pointer-events: none;
    }

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
