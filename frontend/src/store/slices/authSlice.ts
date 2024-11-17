// src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserProfile } from "../../types/types";

const initialState: AuthState = {
  user: null,
  loading: true, // Start with loading true
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, setLoading, setError, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
