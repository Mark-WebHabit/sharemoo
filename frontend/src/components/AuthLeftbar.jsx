import React from "react";
import styled from "styled-components";

import AvatarContainer from "./AvatarContainer";

const AuthLeftbar = () => {
  return (
    <Container>
      <div>
        <h1>ShareMoo!</h1>
        <small>even the smallest events matter</small>
      </div>
      <div className="recent-logins">
        <h1>Recent Logins:</h1>
        <div className="account">
          <AvatarContainer />
          <AvatarContainer src="addacc" imgWidth="70%" />
        </div>
      </div>
    </Container>
  );
};

export default AuthLeftbar;
const Container = styled.div`
  display: flex;
  flex-direction: column;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5em 0 2em 0;

    & h1 {
      font-size: 3rem;
      line-height: 2.4rem;
    }
  }

  & .recent-logins {
    flex: 1;

    & > h1 {
      font-size: 1rem;
      width: 100%;
      padding-left: 1em;
    }

    & .account {
      padding: 1em;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      gap: 1em;
    }
  }
`;
