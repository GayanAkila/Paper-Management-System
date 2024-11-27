import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { State } from "../../types/types";
import { SnackMessage } from "../../config/constant";
import { enqueueSnackbarMessage } from "./commonSlice";
import axios, { HttpStatusCode } from "axios";
import axiosInstance from "../../services/axiosInstance";

interface Author {
  name: string;
  email: string;
}

interface Comment {
  reviewer: string;
  date: string;
  comment: string;
  fileUrl: string;
}

export interface Submission {
  id: string;
  title: string;
  author: string; // (userId) one who made the submission
  authors: Author[];
  type: string;
  status: string;
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  reviewerEmail: string;
  feedback: { comments: Comment[]; finalDecision: string | null };
}

interface SubmissionsState {
  userSubmissions: Submission[];
  allSubmissions: Submission[];
  fetchState: State;
  updateState: State;
  uploadState: State;
  stateMessage: string;
}

// Initial state
const initialState: SubmissionsState = {
  userSubmissions: [],
  allSubmissions: [],
  fetchState: State.idle,
  updateState: State.idle,
  uploadState: State.idle,
  stateMessage: "",
};

export const fetchSubmissionsByAuthor = createAsyncThunk(
  "submissions/fetchSubmissions/by-author",
  async (_, { dispatch, rejectWithValue }) => {
    return new Promise<Submission[]>((resolve, reject) => {
      axiosInstance
        .get("/submissions/by-author")
        .then((response) => {
          console.log("Response: ", response.data);
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
                  ? SnackMessage.error.fetchSubmissions
                  : String(error.response?.data.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const fetchAllSubmissions = createAsyncThunk(
  "submissions/fetchSubmissions",
  async (_, { dispatch, rejectWithValue }) => {
    return new Promise<Submission[]>((resolve, reject) => {
      axiosInstance
        .get("/submissions")
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
                  ? SnackMessage.error.fetchSubmissions
                  : String(error.response?.data.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

interface updateSubmissionPayload {
  id: string;
  formData: FormData;
}

export const updateSubmission = createAsyncThunk(
  "submissions/updateSubmission",
  async (payload: updateSubmissionPayload, { dispatch }) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .put(`/submissions/${payload.id}`, payload.formData)
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.updateSubmission,
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
                  ? SnackMessage.error.updateSubmission
                  : String(error.response?.data?.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

export const createSubmission = createAsyncThunk(
  "submissions/createSubmission",
  async (formData: FormData, { dispatch }) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .post("/submissions", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
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

export const deleteSubmission = createAsyncThunk(
  "submissions/deleteSubmission",
  async (id: string, { dispatch }) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .delete(`/submissions/${id}`)
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.deleteSubmission,
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
                  ? SnackMessage.error.deleteSubmission
                  : String(error.response?.data?.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

// Submissions slice
const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch submissions
      .addCase(fetchSubmissionsByAuthor.pending, (state) => {
        state.fetchState = State.loading;
        state.stateMessage = "Fetching submissions...";
      })
      .addCase(fetchSubmissionsByAuthor.fulfilled, (state, action) => {
        state.userSubmissions = action.payload;
        state.fetchState = State.success;
        state.stateMessage = "Submissions fetched successfully.";
      })
      .addCase(fetchSubmissionsByAuthor.rejected, (state) => {
        state.fetchState = State.failed;
        state.stateMessage = "Failed to fetch submissions.";
      })

      // Update submission
      .addCase(updateSubmission.pending, (state) => {
        state.updateState = State.loading;
        state.stateMessage = "Updating submission...";
      })
      .addCase(updateSubmission.fulfilled, (state, action) => {
        state.updateState = State.success;
        state.stateMessage = "Submission updated successfully.";

        const updatedIndex = state.userSubmissions.findIndex(
          (submission) => submission.id === action.meta.arg.id
        );

        if (updatedIndex !== -1) {
          const { formData } = action.meta.arg;

          // Extract and parse relevant fields from FormData
          const updatedSubmission: Partial<Submission> = {
            title: formData.get("title") as string,
            type: formData.get("type") as string,
            authors: JSON.parse(formData.get("authors") as string),
          };

          // Update only the fields that exist in the formData
          state.userSubmissions[updatedIndex] = {
            ...state.userSubmissions[updatedIndex],
            ...updatedSubmission,
            updatedAt: new Date().toISOString(), // Update timestamp
          };
        }
      })
      .addCase(
        updateSubmission.rejected,
        (state, action: PayloadAction<any>) => {
          state.updateState = State.failed;
          state.stateMessage = "Failed to update submission.";
        }
      )

      // create submission
      .addCase(createSubmission.pending, (state) => {
        state.uploadState = State.loading;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.uploadState = State.success;
        state.stateMessage = "Submission created successfully.";
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.uploadState = State.failed;
        state.stateMessage = "Failed to create submission.";
      })

      // Delete submission
      .addCase(deleteSubmission.pending, (state) => {
        state.updateState = State.loading;
        state.stateMessage = "Deleting submission...";
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        console.log("Deleted submission: ", action.payload);
        const deletedIndex = action.meta.arg;
        state.userSubmissions = state.userSubmissions.filter(
          (s) => s.id !== deletedIndex
        );

        state.updateState = State.success;
        state.stateMessage = "Submission deleted successfully.";
      })
      //fetch all submissions
      .addCase(fetchAllSubmissions.pending, (state) => {
        state.fetchState = State.loading;
        state.stateMessage = "Fetching submissions...";
      })
      .addCase(fetchAllSubmissions.fulfilled, (state, action) => {
        state.allSubmissions = action.payload;
        state.fetchState = State.success;
        state.stateMessage = "Submissions fetched successfully.";
      })
      .addCase(fetchAllSubmissions.rejected, (state) => {
        state.fetchState = State.failed;
        state.stateMessage = "Failed to fetch submissions.";
      });
  },
});

// Export actions and reducer
export const {} = submissionsSlice.actions;
export default submissionsSlice.reducer;
