// src/components/LoadingScreen.tsx
import { Box, CircularProgress } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingScreen;
