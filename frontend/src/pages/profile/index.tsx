import { Box, Button, Stack, Typography } from "@mui/material";
import ProfileView from "./components/ProfileView";
import { useAppSelector } from "../../store/store";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);

  const profileData = {
    name: user?.displayName || "user",
    email: user?.email || " ",
    phoneNo: "0774395708",
    registrationNo: "MC98711",
    profilePicture: user?.photoUrl || "",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Take full height of parent
      }}
    >
      {/* Fixed Header */}
      <Box>
        <Typography variant="h4">Profile</Typography>
        <Box>
          <ProfileView profileData={profileData} />
        </Box>
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
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;
