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
import StatusChip from "../../../components/StatusChip";

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
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Change Submission Status
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box>
          <Typography sx={{ mb: 2 }}>
            <strong>Paper:</strong> {paper?.title}
          </Typography>
          <Typography sx={{ mb: 3 }}>
            <strong>Current Status:{"  "}</strong>

            <StatusChip status={paper?.status || "submiited"} />
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
      <DialogActions sx={{ px: 3, pb: 3 }}>
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
