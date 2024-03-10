import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { timeSince } from "../utilities/timeSince.js";
import { instance } from "../config/instance.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PostCard = ({
  id,
  username,
  profile,
  photo,
  text,
  dt,
  user_id = "none",
}) => {
  const [likes, setLikes] = useState(0);
  const [likers, setLikers] = useState([]);
  const userId = useSelector((state) => state.user.loggedInUser.id);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleToggleLike = async (e) => {
    e.preventDefault();
    if (isLiked) {
      const response = await instance.post(`/posts/unlike`, {
        user_id: userId,
        post_id: id,
      });
      if (response.data.data.affectedRows === 1) {
        const newLikers = likers.filter((val) => val.id !== userId);
        setLikers(newLikers);
        setLikes((like) => like - 1);

        setIsLiked(false);
      }
    } else {
      const response = await instance.post("posts/like", {
        user_id: userId,
        post_id: id,
      });
      if (response.data.data[0].affectedRows === 1) {
        const myData = { id: userId };
        setLikers((likers) => [...likers, myData]);
        setLikes((like) => like + 1);

        setIsLiked(true);
      }
    }
  };

  useEffect(() => {
    async function getLikes() {
      const response = await instance.get(`/posts/likes/${id}`);
      setLikes(response.data.data || 0);
    }

    async function getPostLikers() {
      const response = await instance.get(`/posts/likers/${id}`);
      setLikers(response.data.data);
    }

    getLikes();
    getPostLikers();
  }, []);

  useEffect(() => {
    if (!likes && !likers) return;
    if (!likes || likes === 0) return;

    const isExist = likers.some((id) => id.id === userId);
    setIsLiked(isExist);
  }, [likes, likers]);

  const handleRedirectToProfile = () => {
    navigate(`/profile/${user_id}`);
  };

  return (
    <Container $src={profile || "/media/user.png"}>
      <div className="postowner-header">
        <div
          className="avatar-container"
          onClick={handleRedirectToProfile}
        ></div>
        <div className="post-info">
          <p className="owner-name" onClick={handleRedirectToProfile}>
            {username}
          </p>
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
        <div className="action likes" onClick={handleToggleLike}>
          <img src={`/media/${isLiked ? "liked" : "like"}.png`} alt="Like" />
          <p>{likes === 0 || likes > 1 ? `${likes} likes` : `${likes} like`}</p>
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
      background: url(${(props) => props.$src}) no-repeat center center / cover;
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
