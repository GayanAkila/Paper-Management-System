import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserProfile } from "../../types/types";
import { logoutUser } from "../../services/authService";

const initialState: AuthState = {
  user: null,
  loading: true,
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
      // localStorage.setItem("idToken", action.payload.idToken);
      // localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      console.log("logout");
      // Clear tokens from localStorage
      logoutUser();
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
