import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { State } from "../../types/types";
import { SnackMessage } from "../../config/constant";
import { enqueueSnackbarMessage } from "./commonSlice";
import axios, { HttpStatusCode } from "axios";
import axiosInstance from "../../services/axiosInstance";

export interface Author {
  name: string;
  email: string;
}

export interface Comment {
  reviewer: string;
  comments: string;
  decision: string;
  submittedAt: string;
  fileUrl?: string;
}

export interface certificate {
  certificateUrl: string;
  email: string;
  name: string;
}

export interface Submission {
  id: string;
  title: string;
  author: string;
  authors: Author[];
  type: string;
  status: string;
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  reviewers: string[];
  reviews?: {
    comments: Comment[];
  };
  certificateUrls?: certificate[];
}

interface SubmissionsState {
  userSubmissions: Submission[];
  allSubmissions: Submission[];
  reviewersSubmissions: Submission[];
  fetchState: State;
  updateState: State;
  uploadState: State;
  reUploadState: State;
  stateMessage: string;
  assignReviewersState: State;
  getReviewsState: State;
}

// Initial state
const initialState: SubmissionsState = {
  userSubmissions: [],
  allSubmissions: [],
  reviewersSubmissions: [],
  fetchState: State.idle,
  updateState: State.idle,
  uploadState: State.idle,
  reUploadState: State.idle,
  assignReviewersState: State.idle,
  getReviewsState: State.idle,
  stateMessage: "",
};

export const fetchSubmissionsByAuthor = createAsyncThunk(
  "submissions/fetchSubmissions/by-author",
  async (_, { dispatch, rejectWithValue }) => {
    return new Promise<Submission[]>((resolve, reject) => {
      axiosInstance
        .get("/submissions/by-author")
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

interface editSubmissionPayload {
  id: string;
  formData: FormData;
}

export const editSubmission = createAsyncThunk(
  "submissions/editSubmission",
  async (payload: editSubmissionPayload, { dispatch }) => {
    return new Promise<any>((resolve, reject) => {
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

export const editSubmissionStatus = createAsyncThunk(
  "submissions/editSubmissionStatus",
  async (payload: { id: string; status: string }, { dispatch }) => {
    return new Promise<any>((resolve, reject) => {
      axiosInstance
        .put(`/submissions/${payload.id}/status`, { status: payload.status })
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.updateSubmissionStatus,
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
                  ? SnackMessage.error.updateSubmissionStatus
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

export const reSubmission = createAsyncThunk(
  "submissions/reSubmission",
  async (payload: { id: string; formData: FormData }, { dispatch }) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .post(`/submissions/${payload.id}/resubmit`, payload.formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.reSubmission,
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
                  ? SnackMessage.error.reSubmission
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

export const getReviews = createAsyncThunk(
  "submissions/getReviews",
  async (id: string, { dispatch }) => {
    return new Promise<Submission[]>((resolve, reject) => {
      axiosInstance
        .get(`/submissions/${id}/reviews`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(
            enqueueSnackbarMessage({
              message:
                error.response?.status === HttpStatusCode.InternalServerError
                  ? SnackMessage.error.getReviews
                  : String(error.response?.data?.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

interface assignReviewersPayload {
  id: string;
  reviewers: string[];
}

export const addReviewers = createAsyncThunk(
  "submissions/addReviewers",
  async (payload: assignReviewersPayload, { dispatch }) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .post(`/submissions/${payload.id}/assign-reviewers`, {
          reviewers: payload.reviewers,
        })
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.assignReviewers,
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
                  ? SnackMessage.error.assignReviewers
                  : String(error.response?.data?.message),
              type: "error",
            })
          );
          reject(error);
        });
    });
  }
);

interface addReviewsPayload {
  id: string;
  reviews: FormData;
}

export const addReviews = createAsyncThunk(
  "submissions/addReviews",
  async (payload: addReviewsPayload, { dispatch }) => {
    return new Promise<string>((resolve, reject) => {
      axiosInstance
        .post(`/submissions/${payload.id}/review`, payload.reviews, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          dispatch(
            enqueueSnackbarMessage({
              message: SnackMessage.success.addReviews,
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
                  ? SnackMessage.error.addReviews
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
      .addCase(editSubmission.pending, (state) => {
        state.updateState = State.loading;
        state.stateMessage = "Updating submission...";
      })

      .addCase(editSubmission.fulfilled, (state, action) => {
        state.updateState = State.success;
        state.stateMessage = "Submission updated successfully.";

        const updatedIndex = state.userSubmissions.findIndex(
          (submission) => submission.id === action.meta.arg.id
        );

        if (updatedIndex !== -1) {
          const { submission } = action.payload.body;

          // Parse the submission data from the response
          const updatedSubmission = JSON.parse(submission);

          // Update only the fields that exist in the updatedSubmission
          state.userSubmissions[updatedIndex] = {
            ...state.userSubmissions[updatedIndex],
            ...updatedSubmission,
            updatedAt: new Date().toISOString(), // Update timestamp
          };
        }
      })
      .addCase(editSubmission.rejected, (state) => {
        state.updateState = State.failed;
        state.stateMessage = "Failed to update submission.";
      })
      .addCase(editSubmissionStatus.pending, (state) => {
        state.updateState = State.loading;
        state.stateMessage = "Updating submission status...";
      })
      .addCase(editSubmissionStatus.fulfilled, (state, action) => {
        state.updateState = State.success;
        state.stateMessage = "Submission status updated successfully.";
      })

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
      .addCase(deleteSubmission.rejected, (state) => {
        state.updateState = State.failed;
        state.stateMessage = "Failed to delete submission.";
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
      })
      .addCase(addReviewers.pending, (state) => {
        state.assignReviewersState = State.loading;
        state.stateMessage = "Assigning reviewers...";
      })
      .addCase(addReviewers.fulfilled, (state) => {
        state.assignReviewersState = State.success;
        state.stateMessage = "Reviewers assigned successfully.";
      })
      .addCase(addReviewers.rejected, (state) => {
        state.assignReviewersState = State.failed;
        state.stateMessage = "Failed to assign reviewers.";
      })
      .addCase(getReviews.pending, (state) => {
        state.getReviewsState = State.loading;
        state.stateMessage = "Fetching reviews...";
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.getReviewsState = State.success;
        state.reviewersSubmissions = action.payload;
        state.stateMessage = "Reviews fetched successfully.";
      })
      .addCase(getReviews.rejected, (state) => {
        state.getReviewsState = State.failed;
        state.stateMessage = "Failed to fetch reviews.";
      })
      .addCase(reSubmission.pending, (state) => {
        state.reUploadState = State.loading;
        state.stateMessage = "Resubmitting...";
      })
      .addCase(reSubmission.fulfilled, (state) => {
        state.reUploadState = State.success;
        state.stateMessage = "Resubmission successful.";
      })
      .addCase(reSubmission.rejected, (state) => {
        state.reUploadState = State.failed;
        state.stateMessage = "Failed to resubmit.";
      });
  },
});

// Export actions and reducer
export const {} = submissionsSlice.actions;
export default submissionsSlice.reducer;
