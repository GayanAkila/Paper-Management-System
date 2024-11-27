import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import SubmissionDialog from "./components/SubmissionDialog";
import SubmissionCard from "./components/SubmissionCard";
import UploadIcon from "@mui/icons-material/Upload";
import { Author, State } from "../../types/types";

import {
  createSubmission,
  fetchSubmissionsByAuthor,
  Submission,
  deleteSubmission,
  updateSubmission,
} from "../../store/slices/submissionSlice";
import { enqueueSnackbarMessage } from "../../store/slices/commonSlice";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import { LoadingButton } from "@mui/lab";

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const {
    userSubmissions: submissions,
    updateState,
    fetchState,
    uploadState,
  } = useAppSelector((state) => state.submissions);

  // Fetch submissions on component load
  useEffect(() => {
    dispatch(fetchSubmissionsByAuthor());
  }, []);

  // Handle form submission (create or edit)
  const handleSubmit = async (data: {
    type: string;
    title: string;
    file?: File;
    authors: Author[];
  }) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("title", data.title);
    formData.append("authors", JSON.stringify(data.authors));
    if (data.file) {
      formData.append("file", data.file);
    }

    try {
      if (mode === "create") {
        dispatch(createSubmission(formData)).then(() => {
          dispatch(fetchSubmissionsByAuthor());
        });
      } else if (mode === "edit" && selectedSubmission) {
        dispatch(updateSubmission({ id: selectedSubmission.id, formData }));
      }
    } catch (error) {
      dispatch(
        enqueueSnackbarMessage({ message: "Failed to submit", type: "error" })
      );
    } finally {
      setDialogOpen(false);
    }
  };

  // Handle edit submission
  const handleEdit = (submission: Submission) => {
    setSelectedSubmission(submission);
    setMode("edit");
    setDialogOpen(true);
  };

  // Handle delete submission
  const handleDelete = async (id: string) => {
    try {
      dispatch(deleteSubmission(id));
    } catch (error) {
      dispatch(
        enqueueSnackbarMessage({ message: "Failed to delete", type: "error" })
      );
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: 3, pt: 1 }}
      >
        <Typography variant="h4">Dashboard</Typography>
        <LoadingButton
          variant="contained"
          color="primary"
          disabled={submissions.length === 2}
          startIcon={<UploadIcon />}
          loading={uploadState === State.loading}
          onClick={() => {
            setMode("create");
            setSelectedSubmission(null);
            setDialogOpen(true);
          }}
          sx={{ borderRadius: 1 }}
        >
          Upload the file
        </LoadingButton>
      </Box>

      {/* Submission List */}

      {fetchState === State.loading && (
        <Stack height={"100%"}>
          <Box overflow={"hidden"} sx={{ borderRadius: 4, flexGrow: 1 }}>
            <Skeleton
              variant="rounded"
              animation="wave"
              height={"100%"}
              sx={{ borderRadius: 4 }}
            />
          </Box>
        </Stack>
      )}
      {fetchState === State.success && (
        <>
          {submissions.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              No submissions found.
            </Typography>
          )}
          {submissions.length > 0 && (
            <Box
              sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", mt: 1 }}
            >
              <Stack spacing={2}>
                {submissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    onEdit={() => handleEdit(submission)}
                    onDelete={() => handleDelete(submission.id)}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}
      {fetchState === State.failed && (
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Failed to fetch submissions.
        </Typography>
      )}

      {/* Submission Dialog */}
      <SubmissionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={mode}
        initialData={selectedSubmission}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Dashboard;
