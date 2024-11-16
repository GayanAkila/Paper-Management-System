import React from "react";
import { Box, Typography, Card, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface StatCardProps {
  value: number;
  label: string;
  backgroundColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <Card
    sx={{
      background: "linear-gradient(135deg, #7FADE3 0%, #2875C6 100%)",
      color: "white",
      p: 3,
      borderRadius: 2,
      width: "100%",
      display: "flex",
      justifyItems: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 2,
    }}
  >
    <Typography variant="h2" sx={{ fontWeight: 700, fontSize: "4rem" }}>
      {value}
    </Typography>
    <Typography
      sx={{
        textTransform: "uppercase",
        fontWeight: 500,
        color: "white",
        fontSize: 24,
        letterSpacing: "0.1em",
      }}
    >
      {label}
    </Typography>
  </Card>
);

export default StatCard;
