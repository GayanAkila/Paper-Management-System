import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import { enqueueSnackbarMessage } from "./commonSlice";
import { SnackMessage } from "../../config/constant";
import axios, { HttpStatusCode } from "axios";
import { State } from "../../types/types";

interface DeadlineState {
  deadlines: Deadline;
  loading: boolean;
  fetchState: State;
  addState: State;
  updateState: State;
  stateMessage: string | null;
}

interface Deadline {
  submission: string;
  resubmission: string;
}

const initialState: DeadlineState = {
  deadlines: {
    submission: "",
    resubmission: "",
  },
  updateState: State.idle,
  fetchState: State.idle,
  addState: State.idle,
  stateMessage: null,
  loading: false,
};

export const fetchDeadlines = createAsyncThunk(
  "settings/fetchDeadlines",
  async (_, { dispatch, rejectWithValue }) => {
    return new Promise<Deadline>((resolve, reject) => {
      axiosInstance
        .get("/settings/deadlines")
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

export const addDeadline = createAsyncThunk(
  "settings/addDeadlines",
  async (
    deadlines: {
      submission_deadline: string;
      resubmission_deadline: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .post("/settings/deadline-add", deadlines)
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.updateDeadline,
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

export const updateDeadline = createAsyncThunk(
  "settings/updateDeadline",
  async (
    payload: { type: string; deadline: string },
    { dispatch, rejectWithValue }
  ) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .put("/settings/deadline-update", payload)
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.updateDeadline,
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

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateLocalDeadline: (state, action) => {
      state.deadlines = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeadlines.pending, (state) => {
        state.loading = true;
        state.fetchState = State.loading;
      })
      .addCase(fetchDeadlines.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchState = State.success;
        state.deadlines = action.payload;
        state.stateMessage = "succecfully fetched deadlines";
      })
      .addCase(fetchDeadlines.rejected, (state, action) => {
        state.loading = false;
        state.fetchState = State.failed;
        state.stateMessage =
          action.error.message || "Failed to fetch deadlines";
      })
      .addCase(updateDeadline.pending, (state) => {
        state.loading = true;
        state.updateState = State.loading;
      })
      .addCase(updateDeadline.fulfilled, (state, action) => {
        state.loading = false;
        state.updateState = State.success;
        state.stateMessage = "succecfully updated deadlines";
      })
      .addCase(updateDeadline.rejected, (state, action) => {
        state.loading = false;
        state.updateState = State.failed;
        state.stateMessage =
          action.error.message || "Failed to update deadlines";
      })
      .addCase(addDeadline.pending, (state) => {
        state.loading = true;
        state.addState = State.loading;
      })
      .addCase(addDeadline.fulfilled, (state, action) => {
        state.loading = false;
        state.addState = State.success;
        state.stateMessage = "succecfully added deadlines";
      })
      .addCase(addDeadline.rejected, (state, action) => {
        state.loading = false;
        state.addState = State.failed;
        state.stateMessage = action.error.message || "Failed to add deadlines";
      });
  },
});

export const { updateLocalDeadline } = settingsSlice.actions;
export default settingsSlice.reducer;
