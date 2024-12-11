import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  forgotPasswordAsync,
  clearPasswordState,
} from "../../store/slices/authSlice";

interface ResetPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  setEmail: (email: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  isOpen,
  onClose,
  email,
  setEmail,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error, success, message } = useAppSelector(
    (state) => state.auth.passwordState
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await dispatch(forgotPasswordAsync({ email })).unwrap();
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const handleClose = () => {
    dispatch(clearPasswordState());
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reset Password</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {(error || success) && (
            <Alert severity={success ? "success" : "error"} sx={{ mb: 2 }}>
              {message || error}
            </Alert>
          )}

          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || success}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || success || !email}
          >
            {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ResetPassword;
