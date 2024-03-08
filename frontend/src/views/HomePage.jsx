import React, { useState, useEffect } from "react";
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
  const { responseCount } = useSelector((state) => state.posts);

  const handleAddPost = () => {
    setAddPost(!addPost);
  };

  // Function to fetch posts
  const fetchPosts = async () => {
    try {
      const limit = 10; // Number of posts to fetch per request

      dispatch(fetchAllPosts({ offset, limit }));
      setOffset((prevOffset) => prevOffset + responseCount);
      if (responseCount < limit) {
        setHasMore(false); // No more posts to fetch
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a message)
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to handle scroll and check if near bottom
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      !hasMore
    )
      return;
    fetchPosts();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <Container>
      {addPost && <PostModal handleAddPost={handleAddPost} />}
      <AddPost handleAddPost={handleAddPost} />
      {posts &&
        posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
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

const Container = styled.div``;
