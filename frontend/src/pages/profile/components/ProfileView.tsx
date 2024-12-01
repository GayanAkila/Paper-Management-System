import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  Button,
  Stack,
} from "@mui/material";

interface ProfileViewProps {
  profileData: {
    name: string;
    email: string;

    profilePicture?: string;
  };
}

const InfoRow = ({
  label,
  value,
  isAvatar = false,
}: {
  label: string;
  value: string;
  isAvatar: Boolean;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      py: 3,
      borderBottom: "1px solid #E5E7EB",
      "&:last-child": {
        borderBottom: "none",
      },
    }}
  >
    <Typography
      variant="body1"
      sx={{
        color: "#1F2937",
        fontWeight: 500,
        width: "200px",
      }}
    >
      {label}
    </Typography>
    {isAvatar ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#4B5563",
            ml: 4.5,
          }}
        >
          A picture helps people recognize you
        </Typography>
        <Avatar
          src={value}
          sx={{
            width: 80,
            height: 80,
            border: "4px solid #F3F4F6",
          }}
        />
      </Box>
    ) : (
      <Typography
        variant="body1"
        sx={{
          color: "#4B5563",
          flex: 1,
        }}
      >
        {value}
      </Typography>
    )}
  </Box>
);

const ProfileView = ({ profileData }: ProfileViewProps) => {
  return (
    <Container maxWidth="lg">
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#FFFFFF",

          mb: 3,
        }}
      >
        <Box>
          <InfoRow
            label="Profile Picture"
            value={profileData.profilePicture || ""}
            isAvatar={true}
          />
          <InfoRow label="Name" value={profileData.name} isAvatar={false} />
          <InfoRow label="Email" value={profileData.email} isAvatar={false} />
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileView;
