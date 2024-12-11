import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Submission } from "../../../store/slices/submissionSlice";

interface StatusDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (status: string) => void;
  paper: Partial<Submission>;
}

const StatusDialog: React.FC<StatusDialogProps> = ({
  open,
  onClose,
  onSubmit,
  paper,
}) => {
  const [status, setStatus] = useState("");

  const handleSubmit = () => {
    onSubmit(status);
    setStatus("");
    onClose();
  };

  const handleClose = () => {
    setStatus("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Change Submission Status
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography sx={{ mb: 2 }}>
            <strong>Paper:</strong> {paper?.title}
          </Typography>
          <Typography sx={{ mb: 3, color: "text.secondary" }}>
            <strong>Current Status:</strong> {paper?.status}
          </Typography>
          <FormControl fullWidth required>
            <InputLabel>New Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="New Status"
            >
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="needs revision">Needs Revision</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!status}>
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;
