import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import { enqueueSnackbarMessage } from "./commonSlice";
import { State } from "../../types/types";

interface LetterState {
  letterUrls: { [key: string]: string };
  generateState: State;
  sendState: State;
  error: string | null;
}

const initialState: LetterState = {
  letterUrls: {},
  generateState: State.idle,
  sendState: State.idle,
  error: null,
};

export const generateAppreciationLetter = createAsyncThunk(
  "letters/generate",
  async (reviewerId: string, { dispatch }) => {
    try {
      const response = await axiosInstance.post(
        `/appreciation-letters/${reviewerId}`
      );
      dispatch(
        enqueueSnackbarMessage({
          message: "Letter generated successfully",
          type: "success",
        })
      );
      return { reviewerId, url: response.data.letterUrl };
    } catch (error: any) {
      dispatch(
        enqueueSnackbarMessage({
          message: error.response?.data?.message || "Failed to generate letter",
          type: "error",
        })
      );
      throw error;
    }
  }
);

export const sendAppreciationLetter = createAsyncThunk(
  "letters/send",
  async (reviewerId: string, { dispatch }) => {
    try {
      await axiosInstance.post(`/appreciation-letters/${reviewerId}/send`);
      dispatch(
        enqueueSnackbarMessage({
          message: "Letter sent successfully",
          type: "success",
        })
      );
      return reviewerId;
    } catch (error: any) {
      dispatch(
        enqueueSnackbarMessage({
          message: error.response?.data?.message || "Failed to send letter",
          type: "error",
        })
      );
      throw error;
    }
  }
);

const letterSlice = createSlice({
  name: "letters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateAppreciationLetter.pending, (state) => {
        state.generateState = State.loading;
        state.error = null;
      })
      .addCase(generateAppreciationLetter.fulfilled, (state, action) => {
        state.generateState = State.success;
        state.letterUrls[action.payload.reviewerId] = action.payload.url;
        state.error = null;
      })
      .addCase(generateAppreciationLetter.rejected, (state, action) => {
        state.generateState = State.failed;
        state.error = action.error.message || "Failed to generate letter";
      })
      .addCase(sendAppreciationLetter.pending, (state) => {
        state.sendState = State.loading;
        state.error = null;
      })
      .addCase(sendAppreciationLetter.fulfilled, (state) => {
        state.sendState = State.success;
        state.error = null;
      })
      .addCase(sendAppreciationLetter.rejected, (state, action) => {
        state.sendState = State.failed;
        state.error = action.error.message || "Failed to send letter";
      });
  },
});

export default letterSlice.reducer;
