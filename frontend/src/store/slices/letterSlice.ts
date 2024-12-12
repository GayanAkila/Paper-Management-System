// src/store/slices/letterSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HttpStatusCode } from "axios";
import { enqueueSnackbarMessage } from "./commonSlice";
import { State } from "../../types/types";
import { SnackMessage } from "../../config/constant";
import axiosInstance from "../../services/axiosInstance";

interface LetterUrls {
  [reviewerId: string]: string;
}

interface LetterState {
  letterUrls: LetterUrls;
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


export const uploadAppreciationLetter = createAsyncThunk(
  "letters/upload",
  async (
    {
      reviewerId,
      file,
    }: {
      reviewerId: string;
      file: FormData;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/certificates/appreciation-letters/${reviewerId}`,
        file,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      dispatch(
        enqueueSnackbarMessage({
          message: "Appreciation letter uploaded and sent successfully",
          type: "success",
        })
      );
      return { reviewerId, letterUrl: response.data.letterUrl };
    } catch (error: any) {
      dispatch(
        enqueueSnackbarMessage({
          message:
            error.response?.status === HttpStatusCode.InternalServerError
              ? "Failed to process appreciation letter"
              : String(error.response?.data?.message),
          type: "error",
        })
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const letterSlice = createSlice({
  name: "letters",
  initialState,
  reducers: {
    resetLetterState: (state) => {
      state.generateState = State.idle;
      state.sendState = State.idle;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Letter
      .addCase(uploadAppreciationLetter.pending, (state) => {
        state.generateState = State.loading;
        state.error = null;
      })
      .addCase(uploadAppreciationLetter.fulfilled, (state, action) => {
        state.generateState = State.success;
        state.letterUrls[action.payload.reviewerId] = action.payload.letterUrl;
      })
      .addCase(uploadAppreciationLetter.rejected, (state, action) => {
        state.generateState = State.failed;
        state.error = (action.payload as string) || "Failed to upload letter";
      });
  },
});

export const { resetLetterState } = letterSlice.actions;
export default letterSlice.reducer;