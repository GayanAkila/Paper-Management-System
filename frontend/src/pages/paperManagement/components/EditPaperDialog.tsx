import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface EditPaperDialogProps {
  open: boolean;
  onClose: () => void;
  paper: {
    id: string;
    title: string;
    author: string;
    type: string;
  } | null;
  onSubmit: (paperData: {
    id: string;
    title: string;
    author: string;
    type: string;
    file?: File;
  }) => void;
}

const EditPaperDialog = ({
  open,
  onClose,
  paper,
  onSubmit,
}: EditPaperDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    type: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (paper) {
      setFormData({
        title: paper.title,
        author: paper.author,
        type: paper.type,
      });
    }
  }, [paper]);

  const handleSubmit = () => {
    if (paper?.id) {
      onSubmit({
        id: paper.id,
        ...formData,
        file: file || undefined,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setFormData({ title: "", author: "", type: "" });
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
      onClose={handleClose}
      maxWidth="sm"
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
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Edit Paper
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="Paper ID"
            value={paper?.id || ""}
            disabled
            fullWidth
          />

          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            fullWidth
            required
          />

          <TextField
            label="Author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            fullWidth
            required
          />

          <FormControl fullWidth required>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <MenuItem value="Research">Research</MenuItem>
              <MenuItem value="Project">Project</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 1,
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPaperDialog;
