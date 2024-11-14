// src/components/SubmissionDialog/SubmissionDialog.tsx
import React, { useState } from "react";
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
} from "@mui/material";
import { Close, Add, Remove } from "@mui/icons-material";

interface Author {
  name: string;
  email: string;
}

interface SubmissionDialogProps {
  open: boolean;
  onClose: () => void;
}

const SubmissionDialog: React.FC<SubmissionDialogProps> = ({
  open,
  onClose,
}) => {
  const [type, setType] = useState<"research" | "project">("research");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [authors, setAuthors] = useState<Author[]>([{ name: "", email: "" }]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setErrors((prev) => ({ ...prev, file: "" }));
      } else {
        setFile(null);
        setErrors((prev) => ({
          ...prev,
          file: "Please upload a PDF file only",
        }));
      }
    }
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
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title) newErrors.title = "Title is required";
    if (!file) newErrors.file = "File is required";
    if (!type) newErrors.type = "Type is required";

    authors.forEach((author, index) => {
      if (!author.name)
        newErrors[`author${index}Name`] = "Author name is required";
      if (!author.email)
        newErrors[`author${index}Email`] = "Author email is required";
      else if (!/\S+@\S+\.\S+/.test(author.email)) {
        newErrors[`author${index}Email`] = "Invalid email format";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // TODO: Implement your submission logic here
      console.log({ type, title, file, authors });
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        }}
      >
        Submit Paper
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) =>
                setType(e.target.value as "research" | "project")
              }
              error={!!errors.type}
            >
              <MenuItem value="research">Research Paper</MenuItem>
              <MenuItem value="project">Project</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Paper Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Upload Paper (PDF only)
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
                fullWidth
                sx={{ height: 56 }}
              >
                {file ? file.name : "Choose File"}
              </Button>
            </label>
            {errors.file && (
              <Typography color="error" variant="caption">
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
                {type === "project" ? "Authors(max 3)" : "Author"}
              </Typography>
              {type === "project" && authors.length < 3 && (
                <Button startIcon={<Add />} onClick={handleAddAuthor}>
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
                  {type === "project" && authors.length > 1 && (
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
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmissionDialog;
