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
            index === self.findIndex((p) => p.id === post.id) // Assuming each post has a unique `id`
        );
        state.error = "";
      })

      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.systemError = action.error.message;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.error = "";
      })
      .addCase(addPost.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
