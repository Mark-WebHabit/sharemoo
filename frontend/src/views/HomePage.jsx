import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../features/postsSlice";

// components
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import PostModal from "../components/PostModal";

const HomePage = () => {
  const [addPost, setAddPost] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  const limit = 10;

  const handleAddPost = () => {
    setAddPost(!addPost);
  };

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await dispatch(fetchAllPosts({ offset, limit }));
      const newPosts = response.payload;

      if (newPosts.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, offset, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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

  return (
    <Container>
      {addPost && <PostModal handleAddPost={handleAddPost} />}
      <AddPost handleAddPost={handleAddPost} />
      {!posts || (!posts.length && <NoPostsAvailable />)}
      {posts &&
        posts.map((post) => (
          <PostCard
            key={post.post_id}
            id={post.post_id}
            username={post.username}
            profile={post.profile}
            text={post.text_content}
            photo={post.photo_content}
            dt={post.created_at}
          />
        ))}
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  & .no-posts {
    text-align: center;
    margin: 1em 0;
  }
`;
