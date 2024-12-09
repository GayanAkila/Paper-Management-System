import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { State, User } from "../../types/types";
import axiosInstance from "../../services/axiosInstance";
import axios, { HttpStatusCode } from "axios";
import { enqueueSnackbarMessage } from "./commonSlice";
import { SnackMessage } from "../../config/constant";

//
interface UserState {
  users: User[];
  loading: boolean;
  fetchState: State;
  addState: State;
  updateState: State;
  deleteState: State;
  stateMessage: string;
}

// initial state
const initialState: UserState = {
  users: [],
  loading: false,
  fetchState: State.idle,
  addState: State.idle,
  updateState: State.idle,
  deleteState: State.idle,
  stateMessage: "",
};

// fetch all users
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { dispatch, rejectWithValue }) => {
    return new Promise<User[]>((resolve, reject) => {
      axiosInstance
        .get("/users")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return rejectWithValue("Request canceled");
          }
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === HttpStatusCode.InternalServerError
                  ? SnackMessage.error.fetchUsers
                  : String(error.response?.data.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

// add user
export const addUser = createAsyncThunk(
  "user/addUser",
  async (user: User, { dispatch, rejectWithValue }) => {
    return new Promise<User>((resolve, reject) => {
      axiosInstance
        .post("auth/register", user)
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.addUser,
              type: "success",
            })
          );
          resolve(response.data);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return rejectWithValue("Request canceled");
          }
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === HttpStatusCode.InternalServerError
                  ? SnackMessage.error.addUser
                  : String(error.response?.data.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

// update user
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (user: Partial<User>, { dispatch, rejectWithValue }) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .put(`users/${user.id}`, user)
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.updateUser,
              type: "success",
            })
          );
          resolve(response.data);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return rejectWithValue("Request canceled");
          }
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === HttpStatusCode.InternalServerError
                  ? SnackMessage.error.updateUser
                  : String(error.response?.data.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

// delete user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string, { dispatch, rejectWithValue }) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .delete(`users/${id}`)
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.deleteUser,
              type: "success",
            })
          );
          resolve(response.data);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return rejectWithValue("Request canceled");
          }
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === HttpStatusCode.InternalServerError
                  ? SnackMessage.error.deleteUser
                  : String(error.response?.data.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    // fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.fetchState = State.loading;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchState = State.success;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.fetchState = State.failed;
        state.stateMessage = action.error.message as string;
      })
      // add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.addState = State.loading;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.loading = false;
        state.addState = State.success;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.addState = State.failed;
        state.stateMessage = action.error.message as string;
      })
      // update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.updateState = State.loading;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.updateState = State.success;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.updateState = State.failed;
        state.stateMessage = action.error.message as string;
      })
      // delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.deleteState = State.loading;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteState = State.success;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.deleteState = State.failed;
        state.stateMessage = action.error.message as string;
      });
  },
});

export const { setLoading } = userSlice.actions;
export default userSlice.reducer;
