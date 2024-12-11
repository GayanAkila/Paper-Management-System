import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  changePasswordAsync,
  clearPasswordState,
} from "../../../store/slices/authSlice";

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error, success, message } = useAppSelector(
    (state) => state.auth.passwordState
  );

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const errors = {
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!validatePassword(formData.newPassword)) {
      errors.newPassword =
        "Password must be at least 8 characters with uppercase, lowercase, and numbers";
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(
        changePasswordAsync({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
      ).unwrap();

      // Reset form if successful
      if (!error) {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setFormErrors({
      newPassword: "",
      confirmPassword: "",
    });
    dispatch(clearPasswordState());
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>Change Password</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {(error || success) && (
            <Alert severity={success ? "success" : "error"} sx={{ mb: 2 }}>
              {message || error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              name="currentPassword"
              label="Current Password"
              type="password"
              fullWidth
              value={formData.currentPassword}
              onChange={handleInputChange}
              disabled={loading || success}
              required
            />
            <TextField
              name="newPassword"
              label="New Password"
              type="password"
              fullWidth
              value={formData.newPassword}
              onChange={handleInputChange}
              disabled={loading || success}
              error={!!formErrors.newPassword}
              helperText={formErrors.newPassword}
              required
            />
            <TextField
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading || success}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            sx={{ borderRadius: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              loading ||
              success ||
              !formData.currentPassword ||
              !formData.newPassword ||
              !formData.confirmPassword
            }
            sx={{ borderRadius: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : "Change Password"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePassword;
