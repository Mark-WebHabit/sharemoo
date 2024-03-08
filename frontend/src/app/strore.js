import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice.js";
import postReducer from "../features/postsSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
  },
});
