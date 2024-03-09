import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../config/instance.js";

import { catchError } from "../utilities/catchError.js";

export const fetchLoggedInUser = createAsyncThunk("/user", async () => {
  try {
    const response = await instance.get("/user");
    return response.data.data[0];
  } catch (error) {
    catchError(error);
  }
});

export const logout = createAsyncThunk("/auth/logout/id", async (id) => {
  try {
    const response = await instance.get(`/auth/logout/${id}`);
    return response.data.data[0];
  } catch (error) {
    catchError(error);
  }
});

const initialState = {
  loggedInUser: {},
  systemError: "",
  fetchStatus: "idle", //idle loading done
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUser.fulfilled, (state, action) => {
        state.systemError = "";
        state.loggedInUser = action.payload;
      })
      .addCase(fetchLoggedInUser.rejected, (state, action) => {
        console.log(action.error);
        state.systemError = action.error.message;
      })
      .addCase(logout.fulfilled, (state, action) => {
        console.log(action.payload);
        // state.loggedInUser = {};
      });
  },
});

export default userSlice.reducer;
