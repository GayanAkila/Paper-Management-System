import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Stack,
  Typography,
  FormControl,
  FormLabel,
  Switch,
  Divider,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { State, User } from "../../../types/types";
import { LoadingButton } from "@mui/lab";
import { useAppSelector } from "../../../store/store";

interface UserEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: User) => void;
  userData: User;
}

const UserEditDialog = ({
  open,
  onClose,
  onSubmit,
  userData,
}: UserEditDialogProps) => {
  const { updateState } = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState<User>({
    id: "",
    name: "",
    email: "",
    role: "",
    isActive: true,
  });

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      role: "",
      isActive: true,
    });
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
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Edit User
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography>
            <strong>Email:</strong> {formData.email}
          </Typography>
          <Typography>
            <strong>Name:</strong> {formData.name}
          </Typography>

          <FormControl fullWidth>
            <InputLabel>User Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              label="User Role"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="reviewer">Reviewer</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label="User Active"
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ borderRadius: 1, textTransform: "none" }}
        >
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          variant="contained"
          loading={updateState === State.loading}
          sx={{ borderRadius: 1, textTransform: "none" }}
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;
