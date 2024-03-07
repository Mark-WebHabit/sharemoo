import React from "react";
import styled from "styled-components";

const Header = () => {
  return (
    <Container>
      <p className="app-name">ShareMoo</p>
      <div className="toggle-img">
        <img src="/media/user.png" alt="" />
        <img src="/media/down.png" alt="" />
      </div>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  height: 10%;
  background: var(--gray);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
  position: fixed;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);

  & .app-name {
    font-size: 1.5rem;
  }

  .toggle-img {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    & img {
      width: 30px;
    }

    & img:last-child {
      width: 20px;
    }
  }
`;
