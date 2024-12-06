import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import { enqueueSnackbarMessage } from "./commonSlice";
import { State } from "../../types/types";
import { SnackMessage } from "../../config/constant";
import { HttpStatusCode } from "axios";

interface CertificateUrl {
  name: string;
  email: string;
  certificateUrl: string;
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

export const generateCertificate = createAsyncThunk(
  "certificates/generate",
  async (submissionId: string, { dispatch }) => {
    return new Promise<any>((resolve, reject) => {
      axiosInstance
        .post(`/certificates/${submissionId}`)
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.createSubmission,
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
                  ? SnackMessage.error.createSubmission
                  : String(error.response?.data?.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const sendCertificateEmails = createAsyncThunk(
  "certificates/sendEmails",
  async (submissionId: string, { dispatch }) => {
    try {
      const response = await axiosInstance.post(
        `/certificates/${submissionId}/send`
      );
      dispatch(
        enqueueSnackbarMessage({
          message: "Certificates sent successfully to authors",
          type: "success",
        })
      );
      return response.data;
    } catch (error: any) {
      dispatch(
        enqueueSnackbarMessage({
          message:
            error.response?.data?.message || "Failed to send certificates",
          type: "error",
        })
      );
      throw error;
    }
  }
);

const certificateSlice = createSlice({
  name: "certificates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateCertificate.pending, (state) => {
        state.generateState = State.loading;
        state.error = null;
      })
      .addCase(generateCertificate.fulfilled, (state, action) => {
        state.generateState = State.success;
        state.certificateUrls = action.payload;
        state.error = null;
      })
      .addCase(generateCertificate.rejected, (state, action) => {
        state.generateState = State.failed;
        state.error = action.error.message || "Failed to generate certificate";
      })
      .addCase(sendCertificateEmails.pending, (state) => {
        state.sendState = State.loading;
        state.error = null;
      })
      .addCase(sendCertificateEmails.fulfilled, (state) => {
        state.sendState = State.success;
      })
      .addCase(sendCertificateEmails.rejected, (state, action) => {
        state.sendState = State.failed;
        state.error = action.error.message || "Failed to send certificates ";
      });
  },
});

export default certificateSlice.reducer;
