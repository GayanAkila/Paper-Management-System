import {
  Box,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Input,
  IconButton as MuiIconButton,
  Stack,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  Download as DownloadIcon,
  RateReview as ReviewIcon,
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reviewData: {
    comment: string;
    decision: string;
    file?: File;
  }) => void;
  submissionTopic: string;
}

const ReviewDialog = ({
  open,
  onClose,
  onSubmit,
  submissionTopic,
}: ReviewDialogProps) => {
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
      setFile(event.target.files[0]);
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
          borderBottom: "1px solid #E2E8F0",
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

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3} sx={{ mt: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Reviewing: {submissionTopic}
          </Typography>

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
              <MenuItem value="Approved">Approve</MenuItem>{" "}
              <MenuItem value="Approved with changes">
                Approve with Changes
              </MenuItem>
              <MenuItem value="Rejected">Reject</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Input
              type="file"
              id="file-input"
              sx={{ display: "none" }}
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
