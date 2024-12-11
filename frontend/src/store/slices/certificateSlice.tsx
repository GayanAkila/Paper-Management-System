// src/store/slices/certificateSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { HttpStatusCode } from "axios";
import { enqueueSnackbarMessage } from "./commonSlice";
import { State } from "../../types/types";
import { SnackMessage } from "../../config/constant";
import axiosInstance from "../../services/axiosInstance";

interface CertificateUrl {
  name: string;
  email: string;
  certificateUrl: string;
  certificateId: string;
}

interface CertificateState {
  certificateUrls: CertificateUrl[];
  generateState: State;
  sendState: State;
  error: string | null;
}

const initialState: CertificateState = {
  certificateUrls: [],
  generateState: State.idle,
  sendState: State.idle,
  error: null,
};

export const sendCertificateEmails = createAsyncThunk(
  "certificates/process",
  async (
    {
      submissionId,
      certificateFiles,
    }: {
      submissionId: string;
      certificateFiles: FormData;
    },
    { dispatch, rejectWithValue }
  ) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .post(`/certificates/${submissionId}`, certificateFiles, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.certificateSent,
              type: "success",
            })
          );
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === HttpStatusCode.InternalServerError
                  ? SnackMessage.error.certificateSent
                  : String(error.response?.data?.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

const certificateSlice = createSlice({
  name: "certificates",
  initialState,
  reducers: {
    resetCertificateState: (state) => {
      state.sendState = State.idle;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Certificates
      .addCase(sendCertificateEmails.pending, (state) => {
        state.sendState = State.loading;
        state.error = null;
      })
      .addCase(sendCertificateEmails.fulfilled, (state, action) => {
        state.sendState = State.success;
        // state.certificateUrls = action.payload.certificateUrls;
      })
      .addCase(sendCertificateEmails.rejected, (state, action) => {
        state.sendState = State.failed;
        state.error =
          (action.payload as string) || "Failed to send certificates";
      });
  },
});

export const { resetCertificateState } = certificateSlice.actions;
export default certificateSlice.reducer;
