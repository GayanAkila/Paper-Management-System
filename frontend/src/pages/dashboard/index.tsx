import { useEffect, useMemo, useState } from "react";
import { Box, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import SubmissionDialog from "./components/SubmissionDialog";
import SubmissionCard from "./components/SubmissionCard";
import UploadIcon from "@mui/icons-material/Upload";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { State } from "../../types/types";

import {
  createSubmission,
  fetchSubmissionsByAuthor,
  Submission,
  deleteSubmission,
  editSubmission,
  reSubmission,
} from "../../store/slices/submissionSlice";
import { enqueueSnackbarMessage } from "../../store/slices/commonSlice";
import { LoadingButton } from "@mui/lab";
import ResubmitDialog from "./components/ResubmitDialog";

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { deadlines } = useAppSelector((state) => state.settings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resubmitDialogOpen, setResubmitDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const {
    userSubmissions: submissions,
    updateState,
    fetchState,
    reUploadState,
    uploadState,
  } = useAppSelector((state) => state.submissions);

  // Fetch submissions on component load
  useEffect(() => {
    dispatch(fetchSubmissionsByAuthor());
  }, []);

  // Handle form submission (create or edit)
  const handleSubmit = async (data: Partial<Submission>, file?: File) => {
    const formData = new FormData();
    formData.append("submission", JSON.stringify(data));
    if (file) {
      formData.append("file", file);
    }

    try {
      if (mode === "create") {
        dispatch(createSubmission(formData)).then(() => {
          dispatch(fetchSubmissionsByAuthor());
        });
      } else if (
        mode === "edit" &&
        selectedSubmission &&
        selectedSubmission.id
      ) {
        console.log("Edit submission: ", selectedSubmission.id);
        dispatch(editSubmission({ id: selectedSubmission.id, formData }));
      }
    } catch (error) {
      dispatch(
        enqueueSnackbarMessage({ message: "Failed to submit", type: "error" })
      );
    } finally {
      setDialogOpen(false);
    }
  };

  const onResubmit = async (data: Partial<Submission>, file?: File) => {
    const formData = new FormData();

    if (selectedSubmission && selectedSubmission.id && file) {
      formData.append("file", file);
      dispatch(
        reSubmission({ id: selectedSubmission?.id || "", formData })
      ).unwrap();
      dispatch(fetchSubmissionsByAuthor());
    }
  };

  // Handle edit submission
  const handleEdit = (submission: Submission) => {
    setSelectedSubmission(submission);
    setMode("edit");
    setDialogOpen(true);
  };

  const handleResubmit = (submission: Submission) => {
    setSelectedSubmission(submission);
    setResubmitDialogOpen(true);
  };

  // Handle delete submission
  const handleDelete = async (id: string) => {
    dispatch(deleteSubmission(id)).then(() => {
      dispatch(fetchSubmissionsByAuthor());
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: 3, pt: 1 }}
      >
        <Typography variant="h4" fontWeight={500}>
          Dashboard
        </Typography>
        <Tooltip
          title={
            submissions.length === 2
              ? "You have reached the maximum number of submissions"
              : new Date(deadlines.submission) < new Date()
              ? "The submission deadline has passed"
              : ""
          }
        >
          <LoadingButton
            variant="contained"
            color="primary"
            disabled={
              submissions.length === 2 ||
              new Date(deadlines.submission) < new Date()
            }
            startIcon={<UploadIcon />}
            loading={
              uploadState === State.loading || updateState === State.loading
            }
            onClick={() => {
              setMode("create");
              setSelectedSubmission(null);
              setDialogOpen(true);
            }}
            sx={{ borderRadius: 1 }}
          >
            Upload the file
          </LoadingButton>
        </Tooltip>
      </Box>

      {/* Submission List */}

      {(fetchState === State.loading || reUploadState === State.loading) && (
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
            <Box
              height={"100%"}
              gap={2}
              display={"flex"}
              flexDirection={"row"}
              sx={{
                height: "100%",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InsertDriveFileOutlinedIcon sx={{ fontSize: 100 }} />
              <Typography
                variant="body1"
                sx={{ textAlign: "center", fontSize: 24 }}
              >
                No submissions found.
              </Typography>
            </Box>
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
                    onResubmit={() => handleResubmit(submission)}
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
      {selectedSubmission && (
        <ResubmitDialog
          open={resubmitDialogOpen}
          onClose={() => setResubmitDialogOpen(false)}
          onSubmit={onResubmit}
          submission={selectedSubmission}
        />
      )}
      {/* Submission Dialog */}
      <SubmissionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={mode}
        submission={selectedSubmission}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Dashboard;
