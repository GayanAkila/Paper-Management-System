import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  fetchDeadlines,
  updateDeadline,
  addDeadline,
  updateLocalDeadline,
} from "../../store/slices/settingsSlice";

const Settings = () => {
  const dispatch = useAppDispatch();
  const { deadlines, loading } = useAppSelector((state) => state.settings);
  const [editSubmission, setEditSubmission] = useState(false);
  const [editResubmission, setEditResubmission] = useState(false);
  const [submissionDate, setSubmissionDate] = useState("");
  const [resubmissionDate, setResubmissionDate] = useState("");

  useEffect(() => {
    setSubmissionDate(String(deadlines.submission) || "");
    setResubmissionDate(String(deadlines.resubmission) || "");
  }, [deadlines]);

  const handleSubmissionUpdate = async () => {
    if (!submissionDate) return;

    await dispatch(
      updateDeadline({
        type: "submission",
        deadline: submissionDate,
      })
    );
    dispatch(fetchDeadlines());
    setEditSubmission(false);
  };

  const handleResubmissionUpdate = async () => {
    if (!resubmissionDate) return;

    await dispatch(
      updateDeadline({
        type: "resubmission",
        deadline: resubmissionDate,
      })
    );
    setEditResubmission(false);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Settings
      </Typography>

      <Stack
        display={"flex"}
        direction={"row"}
        justifyContent={"space-between"}
        spacing={3}
      >
        <Card elevation={0} sx={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Submission Deadline
            </Typography>
            <Grid container spacing={2} alignItems="center">
              {editSubmission ? (
                <>
                  <Grid item xs={8}>
                    <TextField
                      type="datetime-local"
                      fullWidth
                      value={submissionDate ? submissionDate.slice(0, 16) : ""}
                      onChange={(e) => setSubmissionDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="primary"
                        onClick={handleSubmissionUpdate}
                        disabled={!submissionDate}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => setEditSubmission(false)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Stack>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={8}>
                    <Typography>
                      {deadlines.submission
                        ? new Date(deadlines.submission).toLocaleString()
                        : "Not set"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <IconButton
                      color="primary"
                      onClick={() => setEditSubmission(true)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Resubmission Deadline
            </Typography>
            <Grid container spacing={2} alignItems="center">
              {editResubmission ? (
                <>
                  <Grid item xs={8}>
                    <TextField
                      type="datetime-local"
                      fullWidth
                      value={
                        resubmissionDate ? resubmissionDate.slice(0, 16) : ""
                      }
                      onChange={(e) => setResubmissionDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="primary"
                        onClick={handleResubmissionUpdate}
                        disabled={!resubmissionDate}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => setEditResubmission(false)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Stack>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={8}>
                    <Typography>
                      {deadlines.resubmission
                        ? new Date(deadlines.resubmission).toLocaleString()
                        : "Not set"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <IconButton
                      color="primary"
                      onClick={() => setEditResubmission(true)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Settings;
