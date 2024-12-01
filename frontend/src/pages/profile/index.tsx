import { Box, Button, Stack, Typography } from "@mui/material";
import ProfileView from "./components/ProfileView";
import { useAppSelector } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const profileData = {
    name: user?.displayName || "user",
    email: user?.email || " ",

    profilePicture: user?.photoURL || "",
  };

  function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <Box height={"90%"}>
      {/* Fixed Header */}

      <Typography variant="h4">Profile</Typography>
      <Box
        display={"flex"}
        height={"100%"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <ProfileView profileData={profileData} />

        <Stack p={2} display={"flex"} direction={"row"} spacing={2} width={500}>
          <Button variant="contained" sx={{ height: 45, borderRadius: 1.5 }}>
            Edit Profile
          </Button>
          <Button variant="outlined" sx={{ height: 45, borderRadius: 1.5 }}>
            Change Password
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ height: 45, borderRadius: 1.5 }}
            onClick={() => {
              dispatch(logout());
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;
