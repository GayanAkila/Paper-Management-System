import React, { useState } from "react";
import {
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
  IconButton,
  Stack,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    name: string;
    email: string;
    type: "student" | "reviewer";
  }) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  type?: string;
}

const AddUserDialog = ({ open, onClose, onSubmit }: AddUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "" as "student" | "reviewer",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = "Please select a user type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      type: "" as "student" | "reviewer",
    });
    setErrors({});
    onClose();
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
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add New User
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          An email with login credentials will be sent to the user's email
          address.
        </Alert>

        <Stack spacing={3}>
          <TextField
            label="Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            error={!!errors.name}
            helperText={errors.name}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />

          <FormControl error={!!errors.type}>
            <FormLabel required>User Type</FormLabel>
            <RadioGroup
              value={formData.type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  type: e.target.value as "student" | "reviewer",
                });
                if (errors.type) setErrors({ ...errors, type: undefined });
              }}
            >
              <FormControlLabel
                value="student"
                control={<Radio />}
                label="Student"
              />
              <FormControlLabel
                value="reviewer"
                control={<Radio />}
                label="Reviewer"
              />
            </RadioGroup>
            {errors.type && (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {errors.type}
              </Typography>
            )}
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
