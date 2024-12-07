import React from "react";
import { Box, Typography, Card, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface NotificationProps {
  title: string;
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  message,
  onClose,
}) => (
  <Box
    sx={{
      backgroundColor: "#F0F9FF",
      p: 2,
      borderRadius: 2,
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      position: "relative",
    }}
  >
    <InfoOutlinedIcon sx={{ color: "#3B82F6", mt: 0.5 }} />
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, color: "#0F172A", mb: 0.5 }}
      >
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "#475569" }}>
        {message}
      </Typography>
    </Box>
    <IconButton
      onClick={onClose}
      size="small"
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        color: "#64748B",
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </Box>
);

export default Notification;
