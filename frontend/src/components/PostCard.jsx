import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { timeSince } from "../utilities/timeSince.js";
import { instance } from "../config/instance.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectDots, setDeletePostState } from "../features/postsSlice.js";

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
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [ownedPost, setOwnedPost] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authId = useSelector((state) => state.user.loggedInUser).id;
  const selectedDots = useSelector((state) => state.posts.clickDots);

  useEffect(() => {
    setOwnedPost(parseInt(authId) === parseInt(user_id));
  }, [authId, user_id]);

  useEffect(() => {
    if (selectedDots !== id) {
      setShowMoreOptions(false);
    }
  }, [selectedDots]);

  const handleDeletePost = async () => {
    if (!selectedDots) return;
    try {
      dispatch(setDeletePostState(selectedDots));
      const response = await instance.delete(`/posts/delete/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMoreOptions = () => {
    dispatch(setSelectDots(id));
    setShowMoreOptions(!showMoreOptions);
  };

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
      {ownedPost && (
        <div className="more-options">
          <div className="option-wrapper">
            <img
              src="/media/dots.png"
              alt="More Options"
              onClick={handleShowMoreOptions}
            />

            {showMoreOptions && (
              <div className="options">
                <p onClick={handleDeletePost}>Delete</p>
                <p>Edit</p>
              </div>
            )}
          </div>
        </div>
      )}
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
  position: relative;

  & .more-options {
    position: absolute;
    top: 0.5em;
    right: 0.5em;

    & .option-wrapper {
      width: 100%;
      height: 100%;
      position: relative;

      & .options {
        position: absolute;
        background: var(--gray);
        right: 100%;
        top: 0.5em;
        padding: 0.5em 1em;
        border-radius: 0.4em;
        box-shadow: 0px 0px 5px 1px #000;
        z-index: 1;

        & p {
          padding: 0.2em 0.5em;
          transition: all 200ms;

          &:hover {
            background: white;
            color: black;
            cursor: pointer;
          }
        }
      }

      & img {
        cursor: pointer;
      }
    }
  }

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
      cursor: pointer;
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
      cursor: pointer;
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
