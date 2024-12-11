import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Stack,
  Box,
  Divider,
} from "@mui/material";
import { Upload } from "@mui/icons-material";
import { Submission } from "../../../store/slices/submissionSlice";

interface ResubmitDialogProps {
  open: boolean;
  onClose: () => void;
  submission?: Partial<Submission>;
  onSubmit: (data: Partial<Submission>, file?: File) => void;
}

const ResubmitDialog: React.FC<ResubmitDialogProps> = ({
  open,
  onClose,
  submission,
  onSubmit,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentFileName, setCurrentFileName] = useState<string>("");

  useEffect(() => {
    if (submission?.fileUrl) {
      setCurrentFileName(submission.fileUrl.split("/").pop() || "");
    }
    setErrors({});
  }, [submission, open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/msword" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile);
        setCurrentFileName(selectedFile.name);
        setErrors({});
      } else {
        setFile(null);
        setCurrentFileName("");
        setErrors({ file: "Please upload a Word document (.doc or .docx)" });
      }
    }
    event.target.value = "";
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!file) newErrors.file = "File is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({}, file || undefined);
      setFile(null);
      onClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Resubmit Paper
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Upload Updated Paper (Word document only)
            </Typography>
            {currentFileName && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Current file: {currentFileName}
              </Alert>
            )}
            <input
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              id="file-upload"
              type="file"
              hidden
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<Upload />}
                sx={{ height: 56, borderRadius: 1.5 }}
              >
                {file ? file.name : "Choose File"}
              </Button>
            </label>
            {errors.file && (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 1, display: "block" }}
              >
                {errors.file}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ borderRadius: 1.5 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!file}
          sx={{ borderRadius: 1.5 }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResubmitDialog;
