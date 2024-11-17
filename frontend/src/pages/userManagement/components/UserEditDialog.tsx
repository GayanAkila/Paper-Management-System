import React, { useState, useEffect } from "react";
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
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface UserEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    id: string;
    name: string;
    email: string;
    type: "student" | "reviewer";
  }) => void;
  onPasswordReset: (userId: string) => void;
  userData: {
    id: string;
    name: string;
    email: string;
    type: "student" | "reviewer";
  };
}

interface FormErrors {
  name?: string;
  email?: string;
  type?: string;
}

const UserEditDialog = ({
  open,
  onClose,
  onSubmit,
  onPasswordReset,
  userData,
}: UserEditDialogProps) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    type: "" as "student" | "reviewer",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [resetPasswordClicked, setResetPasswordClicked] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        type: userData.type,
      });
    }
  }, [userData]);

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
      id: "",
      name: "",
      email: "",
      type: "" as "student" | "reviewer",
    });
    setErrors({});
    setResetPasswordClicked(false);
    onClose();
  };

  const handlePasswordReset = () => {
    onPasswordReset(userData.id);
    setResetPasswordClicked(true);
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
          Edit User
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="User ID"
            fullWidth
            value={userData?.id || ""}
            disabled
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "#F8FAFC",
              },
            }}
          />

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

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Password Management
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              onClick={handlePasswordReset}
              sx={{
                textTransform: "none",
                borderRadius: 1,
              }}
            >
              Reset Password
            </Button>
            {resetPasswordClicked && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Password reset email has been sent to the user's email address.
              </Alert>
            )}
          </Box>
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
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;
