import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ProfileView from "./components/ProfileView";
import ChangePassword from "./components/ChangePassword";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout, updateUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { signOut } from "@firebase/auth";
import { auth } from "../../config/firebase";
import { enqueueSnackbarMessage } from "../../store/slices/commonSlice";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/auth");
    } catch (error) {
      dispatch(
        enqueueSnackbarMessage({
          message: (error as Error).message,
          type: "error",
        })
      );
    }
  };

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditFormData({
      displayName: user?.displayName || "",
      email: user?.email || "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      await dispatch(updateUser(editFormData));
      handleEditDialogClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const profileData = {
    name: user?.displayName || "user",
    email: user?.email || "",
    profilePicture: user?.photoURL || "",
  };

  return (
    <Box height={"100%"} pb={4}>
      <Typography variant="h4" fontWeight={500}>
        Profile
      </Typography>
      <Box
        display={"flex"}
        height={"100%"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <ProfileView profileData={profileData} />

        <Stack p={2} display={"flex"} direction={"row"} spacing={2}>
          <Button
            variant="contained"
            sx={{ height: 45, borderRadius: 1.5 }}
            onClick={handleEditDialogOpen}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            sx={{ height: 45, borderRadius: 1.5 }}
            onClick={() => setIsChangePasswordDialogOpen(true)}
          >
            Change Password
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ height: 45, borderRadius: 1.5 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>

        {/* Edit Profile Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onClose={handleEditDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                name="displayName"
                label="Name"
                fullWidth
                value={editFormData.displayName}
                onChange={handleInputChange}
              />
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={editFormData.email}
                onChange={handleInputChange}
                disabled
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleEditDialogClose}
              variant="outlined"
              sx={{ borderRadius: 1.5 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProfileUpdate}
              variant="contained"
              sx={{ borderRadius: 1.5 }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Change Password Dialog */}
        <ChangePassword
          isOpen={isChangePasswordDialogOpen}
          onClose={() => setIsChangePasswordDialogOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default Profile;
