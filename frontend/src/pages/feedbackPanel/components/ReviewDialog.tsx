import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  IconButton as MuiIconButton,
  Stack,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  Divider,
} from "@mui/material";
import {
  Download as DownloadIcon,
  RateReview as ReviewIcon,
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Submission } from "../../../store/slices/submissionSlice";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reviewData: {
    comment: string;
    decision: string;
    file?: File;
  }) => void;
  submission: Submission;
  currentReviewer: string;
}

const ReviewDialog = ({
  open,
  onClose,
  onSubmit,
  submission,
  currentReviewer,
}: ReviewDialogProps) => {
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const currentReviewerFeedback = useMemo(
    () =>
      submission.feedback?.comments.find(
        (comment) => comment.reviewer === currentReviewer
      ),
    [submission, currentReviewer]
  );

  useEffect(() => {
    if (open && currentReviewerFeedback) {
      setComment(currentReviewerFeedback.comment);
      setDecision(submission.feedback?.finalDecision || "");
      setFile(null);
    } else {
      setComment("");
      setDecision("");
      setFile(null);
    }
  }, [open, currentReviewerFeedback, submission.feedback?.finalDecision]);

  const handleSubmit = () => {
    if (!comment || !decision) return;

    onSubmit({
      comment,
      decision,
      file: file || undefined,
    });

    // Reset form
    setComment("");
    setDecision("");
    setFile(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        // Show error for invalid file type
        alert("Please upload only PDF files");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Review Submission
        </Typography>
        <MuiIconButton onClick={onClose} size="small">
          <CloseIcon />
        </MuiIconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Show existing feedback if available */}
          {currentReviewerFeedback && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Your Previous Review:</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {currentReviewerFeedback.comment}
              </Typography>
              {currentReviewerFeedback.fileUrl && (
                <Button
                  startIcon={<DownloadIcon />}
                  size="small"
                  onClick={() => {
                    if (currentReviewerFeedback.fileUrl) {
                      window.open(currentReviewerFeedback.fileUrl, "_blank");
                    }
                  }}
                  sx={{ mt: 1 }}
                >
                  View Previous Attachment
                </Button>
              )}
            </Alert>
          )}

          {/* Review Form */}
          <TextField
            label="Review Comments"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            required
            placeholder="Enter your review comments here..."
          />

          <FormControl required fullWidth>
            <InputLabel>Final Decision</InputLabel>
            <Select
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              label="Final Decision"
            >
              <MenuItem value="Approved">Approve</MenuItem>
              <MenuItem value="Approved with changes">
                Approve with Changes
              </MenuItem>
              <MenuItem value="Rejected">Reject</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <input
              accept="application/pdf"
              id="file-input"
              type="file"
              hidden
              onChange={handleFileChange}
            />
            <label htmlFor="file-input">
              <Button
                component="span"
                startIcon={<AttachFileIcon />}
                variant="outlined"
                sx={{ mr: 2 }}
              >
                Attach File
              </Button>
            </label>
            {file && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected file: {file.name}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ borderRadius: 1.5 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!comment || !decision}
          sx={{ borderRadius: 1.5 }}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
