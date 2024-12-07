import { Dispatch, FC, SetStateAction } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";

interface ResetPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  handlePasswordReset: () => Promise<void>;
  resetPasswordEmail: string;
  resetPasswordSuccess: string | null;
  resetPasswordError: string | null;
  setResetPasswordEmail: Dispatch<SetStateAction<string>>;
}

const ResetPassword: FC<ResetPasswordProps> = (props) => {
  const {
    isOpen,
    onClose,
    handlePasswordReset,
    resetPasswordEmail,
    resetPasswordSuccess,
    resetPasswordError,
    setResetPasswordEmail,
  } = props;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Password Reset</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {resetPasswordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {resetPasswordSuccess}
            </Alert>
          )}
          {resetPasswordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resetPasswordError}
            </Alert>
          )}
          <TextField
            type="email"
            value={resetPasswordEmail}
            onChange={(e) => setResetPasswordEmail(e.target.value)}
            label="Email"
            fullWidth
            autoFocus
            margin="dense"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handlePasswordReset} variant="contained">
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPassword;
