import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, UserProfile } from "../../types/types";
import { 
  logoutUser, 
  changePassword, 
  forgotPassword, 
  resetPassword,
  PasswordChangeData,
  ForgotPasswordData,
  ResetPasswordData 
} from "../../services/authService";

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  passwordState: {
    loading: false,
    error: null,
    success: false,
    message: null
  }
};

// Async thunks for password management
export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (data: PasswordChangeData, { rejectWithValue }) => {
    try {
      const response = await changePassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (data: ForgotPasswordData, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await resetPassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

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
    clearPasswordState: (state) => {
      state.passwordState = {
        loading: false,
        error: null,
        success: false,
        message: null
      };
    },
  },
  extraReducers: (builder) => {
    // Change Password
    builder
      .addCase(changePasswordAsync.pending, (state) => {
        state.passwordState.loading = true;
        state.passwordState.error = null;
        state.passwordState.success = false;
        state.passwordState.message = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        state.passwordState.loading = false;
        state.passwordState.success = true;
        state.passwordState.message = action.payload.message;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.passwordState.loading = false;
        state.passwordState.error = action.payload as string;
        state.passwordState.success = false;
      })

    // Forgot Password
    builder
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.passwordState.loading = true;
        state.passwordState.error = null;
        state.passwordState.success = false;
        state.passwordState.message = null;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
        state.passwordState.loading = false;
        state.passwordState.success = true;
        state.passwordState.message = action.payload.message;
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.passwordState.loading = false;
        state.passwordState.error = action.payload as string;
        state.passwordState.success = false;
      })

    // Reset Password
    builder
      .addCase(resetPasswordAsync.pending, (state) => {
        state.passwordState.loading = true;
        state.passwordState.error = null;
        state.passwordState.success = false;
        state.passwordState.message = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state, action) => {
        state.passwordState.loading = false;
        state.passwordState.success = true;
        state.passwordState.message = action.payload.message;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.passwordState.loading = false;
        state.passwordState.error = action.payload as string;
        state.passwordState.success = false;
      });
  },
});

export const { 
  login, 
  logout, 
  setLoading, 
  setError, 
  updateUser,
  clearPasswordState 
} = authSlice.actions;

export default authSlice.reducer;