import { Box, Typography } from "@mui/material";
import React from "react";

const AdminDashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Take full height of parent
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          pt: 1,
        }}
      >
        <Typography variant="h4">Dashboard</Typography>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
