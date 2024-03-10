import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthUserPosts } from "../features/postsSlice";
import storage from "../firebase/config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setProfile } from "../features/userSlice.js";

// components
import PostCard from "../components/PostCard";
import { instance } from "../config/instance.js";

const Profile = () => {
  const profileContainerRef = useRef();
  const uploadProfileRef = useRef();
  const textAreaRef = useRef();
  const [desc, setDesc] = useState("");
  const [editDesc, setEditDesc] = useState(false);
  const [profileContainerRefShown, setProfileContainerRefShown] =
    useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { authUserPosts } = useSelector((state) => state.posts);
  const current_user = useSelector((state) => state.user.loggedInUser);
  const limit = 10;

  useEffect(() => {
    if (current_user.profile) {
      setProfilePhoto(current_user.profile);
    } else {
      setProfilePhoto("/media/user.png");
    }
  }, [current_user.profile]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      let imageUrl;
      const storageRef = ref(storage, `profiles/${file?.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);

        if (imageUrl && current_user.id) {
          const response = await instance.post("/posts/upload-profile", {
            user_id: current_user.id,
            downloadUrl: imageUrl,
          });

          if (response.data) {
            dispatch(setProfile(imageUrl));
            setPreviewImage(null);
          }
        }
      } catch (error) {
        console.error(error.message);
        // Handle the error appropriately, e.g., by showing an error message to the user
        return; // Exit the function if there was an error during file upload
      }
    }
  };

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;
    const user_id = current_user.id;

    try {
      const response = await dispatch(
        fetchAuthUserPosts({ offset, limit, user_id })
      );
      const newPosts = response.payload;

      if (newPosts?.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, offset, hasMore, current_user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (profileContainerRef.current) {
      setProfileContainerRefShown(true);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
      setOffset((prevOffset) => prevOffset + 10); // Assuming each batch fetches 10 posts
    }
  }, [hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const NoPostsAvailable = () => <h1 className="no-posts">No Posts Yet</h1>;

  useEffect(() => {
    // Function to adjust the height
    const adjustHeight = () => {
      if (textAreaRef && textAreaRef.current) {
        textAreaRef.current.style.height = "auto"; // Reset the height
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set to scroll height
      }
    };

    // Adjust height on text change
    adjustHeight();
  }, [desc]); // Depend on `text` to adjust height when it changes

  const handleChange = (e) => {
    setDesc(e.target.value);
  };

  const handleEditDesc = () => {
    setEditDesc(!editDesc);
  };

  useEffect(() => {
    if (editDesc) {
      textAreaRef.current.focus();
    } else {
      setDesc("");
    }
  }, [editDesc]);

  return (
    <Container
      $refWidth={profileContainerRef?.current?.clientWidth}
      $src={current_user.profile || "/media/noprofile.png"}
    >
      <div className="auth-user" ref={profileContainerRef}>
        <div
          className="profile-container"
          onClick={() => uploadProfileRef.current.click()}
        >
          {profileContainerRefShown && (
            <div className="avatar-container">
              <input
                type="file"
                name="profile"
                id="profile-input"
                ref={uploadProfileRef}
                accept=".jpg, .jpeg"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
        <div className="user-info">
          <p>{current_user && current_user.username}</p>
          <span>{current_user && current_user.email}</span>

          {/* futurew development */}
          <small>0 Friends</small>

          <form className="desc">
            <textarea
              ref={textAreaRef}
              name="desc"
              id="desc"
              placeholder="Add Description"
              maxLength={100}
              onChange={handleChange}
              value={desc}
              disabled={!editDesc}
            ></textarea>
            <div className="buttons">
              <img
                src={`/media/${editDesc ? "cancel" : "edit"}.png`}
                alt=""
                onClick={handleEditDesc}
              />
              {editDesc && <img src="/media/save.png" alt="" />}
            </div>
          </form>
        </div>
      </div>
      {!authUserPosts || (!authUserPosts?.length && <NoPostsAvailable />)}
      {authUserPosts &&
        authUserPosts?.length &&
        authUserPosts.map((post) => (
          <PostCard
            key={post.post_id}
            id={post.post_id}
            username={post.username}
            profile={profilePhoto}
            text={post.text_content}
            photo={post.photo_content}
            dt={post.created_at}
          />
        ))}
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  & .no-posts {
    text-align: center;
    margin: 1em 0;
  }
  .auth-user {
    display: flex;
    align-items: center;
    padding: 1em;
    gap: 1em;

    & .profile-container {
      width: ${(props) =>
        props.$refWidth ? `${props.$refWidth * 0.18}px` : "auto"};
      height: ${(props) =>
        props.$refWidth ? `${props.$refWidth * 0.18}px` : "auto"};
      border: 2px solid white;
      border-radius: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: url(${(props) => props.$src}) no-repeat center center / cover;

      & .avatar-container {
        & img:not(#profile-input) {
          pointer-events: none;
        }
        & #profile-input {
          display: none;
        }
      }
    }

    & .user-info {
      width: 60%;
      padding: 1em;
      & p {
        font-size: 2rem;
        line-height: 1.2rem;
      }

      & span {
        font-size: 1rem;
      }

      & small {
        display: block;
        font-size: 0.7rem;
        margin: 0.5em 0;
      }

      & .desc {
        margin: 1em 0;
        width: 80%;
        position: relative;

        & .buttons {
          position: absolute;
          top: -50%;
          right: 0;

          & img {
            width: 20px;
            margin: 0 0.5em;
          }
        }

        & textarea {
          width: 100%;
          text-align: center;
          background: transparent;
          border: none;
          resize: none;
          height: auto;
          overflow-y: hidden;
          padding: 1em;
          max-height: 50px;
          &:focus {
            outline: none;
          }
        }
      }
    }
  }
`;
