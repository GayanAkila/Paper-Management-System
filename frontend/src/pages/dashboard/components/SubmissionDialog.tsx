import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Alert,
  Stack,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { Close, Add, Remove, Upload } from "@mui/icons-material";
import { SubmissionType } from "../../../types/types";
import { Author, Submission } from "../../../store/slices/submissionSlice";
import { useAppSelector } from "../../../store/store";

interface SubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  submission?: Partial<Submission> | null;
  onSubmit: (data: Partial<Submission>, file?: File) => void;
}

const SubmissionDialog: React.FC<SubmissionDialogProps> = ({
  open,
  onClose,
  mode,
  submission,
  onSubmit,
}) => {
  const { deadlines } = useAppSelector((state) => state.settings);
  const [type, setType] = useState<string>(SubmissionType.research);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [authors, setAuthors] = useState<Author[]>([{ name: "", email: "" }]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentFileName, setCurrentFileName] = useState<string>("");

  // Initialize form with data when editing
  useEffect(() => {
    if (mode === "edit" && submission) {
      // Set type by matching the exact string
      setType(submission.type || SubmissionType.research);
      setTitle(submission.title || "");
      setAuthors(submission.authors || [{ name: "", email: "" }]);
      if (submission.fileUrl) {
        setCurrentFileName(submission.fileUrl.split("/").pop() || "");
      }
    } else {
      // Reset form for create mode
      setType(SubmissionType.research);
      setTitle("");
      setFile(null);
      setAuthors([{ name: "", email: "" }]);
      setCurrentFileName("");
    }
    // Reset errors when dialog opens/closes
    setErrors({});
  }, [mode, submission, open]);

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
        setErrors((prev) => ({ ...prev, file: "" }));
      } else {
        setFile(null);
        setCurrentFileName("");
        setErrors((prev) => ({
          ...prev,
          file: "Please upload a Word document (.doc or .docx)",
        }));
      }
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = "";
  };

  const handleAddAuthor = () => {
    if (authors.length < 3) {
      setAuthors([...authors, { name: "", email: "" }]);
    }
  };

  const handleRemoveAuthor = (index: number) => {
    if (authors.length > 1) {
      const newAuthors = authors.filter((_, i) => i !== index);
      setAuthors(newAuthors);

      // Clear errors for removed author
      const newErrors = { ...errors };
      delete newErrors[`author${index}Name`];
      delete newErrors[`author${index}Email`];
      setErrors(newErrors);
    }
  };

  const handleAuthorChange = (
    index: number,
    field: "name" | "email",
    value: string
  ) => {
    const newAuthors = [...authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);

    // Clear error for the field being edited
    if (
      errors[`author${index}${field.charAt(0).toUpperCase() + field.slice(1)}`]
    ) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[
          `author${index}${field.charAt(0).toUpperCase() + field.slice(1)}`
        ];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!currentFileName && !file && mode === "create") {
      newErrors.file = "File is required";
    }
    if (!type) newErrors.type = "Type is required";

    authors.forEach((author, index) => {
      if (!author.name.trim())
        newErrors[`author${index}Name`] = "Author name is required";
      if (!author.email.trim())
        newErrors[`author${index}Email`] = "Author email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author.email)) {
        newErrors[`author${index}Email`] = "Invalid email format";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      onSubmit(
        {
          type,
          title: title.trim(),
          authors: authors.map((author) => ({
            name: author.name.trim(),
            email: author.email.trim(),
          })),
        },
        file || undefined
      );
      handleClose();
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const selectedType = event.target.value as string;
    setType(selectedType);

    // If changing from Project to Research Paper, keep only one author
    if (selectedType === SubmissionType.research && authors.length > 1) {
      setAuthors([authors[0]]);
    }
  };

  const isProject = type === SubmissionType.project;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
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
        <Typography variant="h6">
          {mode === "create" ? "Submit Paper" : "Edit Paper"}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={handleTypeChange}>
              <MenuItem value={SubmissionType.research}>
                Research Paper
              </MenuItem>
              <MenuItem value={SubmissionType.project}>Project Paper</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Paper Title"
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.title;
                  return newErrors;
                });
              }
            }}
            error={!!errors.title}
            helperText={errors.title}
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {mode === "edit"
                ? "Update Paper (Word document only)"
                : "Upload Paper (Word document only)"}
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
                disabled={mode === "edit"}
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

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle2">
                {isProject ? "Authors (max 3)" : "Author"}
              </Typography>
              {isProject && authors.length < 3 && (
                <Button
                  startIcon={<Add />}
                  onClick={handleAddAuthor}
                  size="small"
                >
                  Add Author
                </Button>
              )}
            </Box>

            {authors.map((author, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <TextField
                      label="Author Name"
                      fullWidth
                      value={author.name}
                      onChange={(e) =>
                        handleAuthorChange(index, "name", e.target.value)
                      }
                      error={!!errors[`author${index}Name`]}
                      helperText={errors[`author${index}Name`]}
                    />
                    <TextField
                      label="Author Email"
                      fullWidth
                      value={author.email}
                      onChange={(e) =>
                        handleAuthorChange(index, "email", e.target.value)
                      }
                      error={!!errors[`author${index}Email`]}
                      helperText={errors[`author${index}Email`]}
                    />
                  </Stack>
                  {isProject && authors.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveAuthor(index)}
                      color="error"
                      sx={{ mt: 1 }}
                    >
                      <Remove />
                    </IconButton>
                  )}
                </Stack>
              </Box>
            ))}
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
          sx={{ borderRadius: 1.5 }}
        >
          {mode === "create" ? "Submit" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmissionDialog;
