import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  IconButton,
  Divider,
  Box,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Submission, Comment } from "../../../store/slices/submissionSlice";
import { useAppSelector } from "../../../store/store";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reviewData: {
    comment: string;
    decision: string;
    file?: File;
  }) => void;
  submission: Submission;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onClose,
  onSubmit,
  submission,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  useEffect(() => {
    if (submission && submission.reviews && user) {
      const userReview = submission.reviews.comments.find(
        (review) => review.reviewer === user.email
      );
      if (userReview) {
        setComment(userReview.comments || "");
        setDecision(userReview.decision || "");
      }
    }
    setFile(null);
    setFileError("");
  }, [open, submission, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError("");

    if (selectedFile) {
      // Check file type
      const validTypes = [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setFileError("Only .doc and .docx files are allowed");
        setFile(null);
        return;
      }

      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError("File size should be less than 5MB");
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      comment,
      decision,
      file: file || undefined,
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setComment("");
    setDecision("");
    setFile(null);
    setFileError("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Submit Review
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Typography>
            <strong>Paper:</strong> {submission?.title}
          </Typography>

          <FormControl fullWidth required>
            <InputLabel>Decision</InputLabel>
            <Select
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              label="Decision"
            >
              <MenuItem value="approve">Approve</MenuItem>
              <MenuItem value="needs revision">Needs Revision</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
            </Select>
          </FormControl>

          <TextField
            required
            multiline
            rows={4}
            label="Comments"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: fileError ? 1 : 0 }}
            >
              Upload Review File (Optional)
              <input
                type="file"
                hidden
                accept=".doc,.docx"
                onChange={handleFileChange}
              />
            </Button>
            {fileError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {fileError}
              </Alert>
            )}
            {file && !fileError && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected file: {file.name}
              </Typography>
            )}
          </Box>
        </Stack>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
        >
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!decision || !comment || !!fileError}
          >
            Submit Review
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
