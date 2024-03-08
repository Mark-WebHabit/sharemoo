import React from "react";
import styled from "styled-components";
import { timeSince } from "../utilities/timeSince.js";

const PostCard = ({ id, username, profile, photo, text, dt }) => {
  return (
    <Container>
      <div className="postowner-header">
        <div className="avatar-container">
          {/* replace the src with the actual profile photo of the user if there is */}
          <img src={profile ? profile : "/media/user.png"} alt="Profile" />
        </div>
        <div className="post-info">
          <p className="owner-name">{username}</p>
          <span className="time-passed">{timeSince(dt)}</span>
        </div>
      </div>
      <hr />
      <div className="post-content">
        {text !== "" && <p>{text}</p>}
        {photo && <img src={photo} />}
      </div>
      <hr />
      <div className="post-action">
        <div className="action likes">
          <img src="/media/like.png" alt="Like" />
          <p>10 likes</p>
        </div>
        <div className="seperator"></div>
        <div className="action comment">
          <img src="/media/chat.png" alt="Like" />
          <p>comments</p>
        </div>
      </div>
    </Container>
  );
};

export default PostCard;

const Container = styled.div`
  border-radius: 0.5em;
  background: var(--gray);
  display: flex;
  flex-direction: column;
  padding: 1em;
  margin-bottom: 1em;

  & .postowner-header {
    display: flex;
    align-items: center;
    padding-bottom: 0.5em;

    & .avatar-container {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid white;
      display: grid;
      place-items: center;
      margin-right: 0.5em;
      & img {
        width: 90%;
      }
    }

    & .post-info .owner-name {
      text-transform: capitalized;
      font-weight: 500;
      font-size: 1rem;
      line-height: 1rem;
    }

    & .post-info .time-passed {
      font-size: 0.5rem;
      color: #bfbfbf;
    }
  }
  & .post-content {
    margin: 0.5em 0;

    & p {
      font-size: 1.1rem;
      margin-bottom: 0.5em;
    }

    & img {
      width: 100%;
    }
  }

  & .post-action {
    display: flex;
    padding: 0.5em 0;

    & .seperator {
      border: 1px solid rgba(0, 0, 0, 0.5);
      margin: 0 1em;
    }

    & .action {
      display: flex;
      align-items: center;
      cursor: pointer;

      & img {
        width: 20px;
      }

      & p {
        font-size: 0.7rem;
        margin-left: 0.5em;
      }
    }
  }
`;
