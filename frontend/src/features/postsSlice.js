import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../config/instance.js";

import { catchError } from "../utilities/catchError.js";

export const fetchAllPosts = createAsyncThunk(
  "/posts",
  async ({ offset, limit }) => {
    try {
      const response = await instance.get(
        `/posts?offset=${offset}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      catchError(error);
    }
  }
);

export const fetchAuthUserPosts = createAsyncThunk(
  "/posts/:user_id",
  async ({ offset, limit, user_id }) => {
    try {
      const response = await instance.get(
        `/posts/${user_id}?offset=${offset}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      catchError(error);
    }
  }
);

export const addPost = createAsyncThunk("/posts/new", async (data) => {
  try {
    const response = await instance.post("/posts/new", data);
    return response.data.data[0];
  } catch (error) {
    catchError(error);
  }
});

const initialState = {
  posts: [],
  authUserPosts: [],
  fetchingStatus: "idle",
  error: "",
  responseCount: 0,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.responseCount = action.payload.length;
        const newPosts = action.payload;
        const allPosts = [...state.posts, ...newPosts];
        state.posts = allPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.post_id === post.post_id) // Assuming each post has a unique `id`
        );
        state.error = "";
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.systemError = action.error.message;
      })
      .addCase(fetchAuthUserPosts.fulfilled, (state, action) => {
        state.responseCount = action.payload.length;
        const newPosts = action.payload;
        const allPosts = [...state.authUserPosts, ...newPosts];
        state.authUserPosts = allPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.post_id === post.post_id) // Assuming each post has a unique `id`
        );
        state.error = "";
      })
      .addCase(fetchAuthUserPosts.rejected, (state, action) => {
        state.systemError = action.error.message;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.authUserPosts.unshift(action.payload);
        state.error = "";
      })
      .addCase(addPost.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
