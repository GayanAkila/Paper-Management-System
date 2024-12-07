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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Submission } from "../../../store/slices/submissionSlice";
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

  console.log(submission);
  useEffect(() => {
    if (
      submission &&
      submission.reviews &&
      user &&
      submission.reviews.finalDecision
    ) {
      const userReview = submission.reviews.comments.find(
        (review) => review.reviewer === user.email
      );
      setComment(userReview ? userReview.comments : "");
      setDecision(submission.reviews.finalDecision || "");
    }

    setFile(null);
  }, [open, submission, user]);

  const handleSubmit = () => {
    onSubmit({
      comment,
      decision,
      file: file || undefined,
    });
    setComment("");
    setDecision("");
    setFile(null);
    onClose();
  };

  const handleClose = () => {
    setComment("");
    setDecision("");
    setFile(null);
    onClose();
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
        <IconButton onClick={onClose} size="small">
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

          <Button variant="outlined" component="label" fullWidth>
            Upload Review File (Optional)
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Button>
          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected file: {file.name}
            </Typography>
          )}
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
            disabled={!decision || !comment}
          >
            Submit Review
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
