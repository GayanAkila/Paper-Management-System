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
  Alert,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Submission,
  updateSubmission,
} from "../../../store/slices/submissionSlice";
import { editSubmission } from "../../../services/submissionService";
import { useAppDispatch } from "../../../store/store";

interface EditPaperDialogProps {
  open: boolean;
  onClose: () => void;
  paper: Submission | null;
}

const EditPaperDialog = ({ open, onClose, paper }: EditPaperDialogProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    type: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

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
    console.log("file", file);
    if (paper?.id) {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("id", paper.id.toString());
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("author", formData.author);
      formDataToSubmit.append("type", formData.type);
      if (file) {
        formDataToSubmit.append("file", file);
      }
      dispatch(updateSubmission({ id: paper.id, formData: formDataToSubmit }));
    }
    handleClose();
  };

  const handleClose = () => {
    setFormData({ title: "", author: "", type: "" });
    setFile(null);
    setFileError(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      console.log("file change", file);
      if (selectedFile.type !== "application/pdf") {
        setFileError("Please upload a valid PDF file.");
        setFile(null);
      } else {
        setFile(selectedFile);
        setFileError(null);
      }
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
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Edit Paper
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
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
              <MenuItem value="Research Paper">Research Paper</MenuItem>
              <MenuItem value="Project">Project</MenuItem>
            </Select>
          </FormControl>

          {/* File Upload Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Upload New File (PDF only)
            </Typography>
            <input
              accept="application/pdf"
              id="file-upload"
              type="file"
              hidden
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                sx={{ textTransform: "none", borderRadius: 1 }}
              >
                {file ? file.name : "Choose File"}
              </Button>
            </label>
            {fileError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {fileError}
              </Alert>
            )}
          </Box>
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
          disabled={!!fileError}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPaperDialog;
