// src/pages/dashboard/Dashboard.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../../store/store";
import SubmissionDialog from "./components/SubmissionDialog";
import SubmissionCard from "./components/SubmissionCard";
import UploadIcon from "@mui/icons-material/Upload";
import { Submission } from "../../types/types";
import theme from "../../theme";

// This interface should match your backend data structure
interface Submission {
  id: string;
  title: string;
  type: "Research" | "Project";
  status: "Pending" | "Approved" | "Rejected";
  submittedOn: string;
  feedback?: string;
}

const Dashboard = () => {
  const [openSubmissionDialog, setOpenSubmissionDialog] = useState(false);

  // Example submissions data - replace with actual data from your backend
  const submissions: Submission[] = [
    {
      id: "1",
      title: "The Impact of AI on Business Decision Making",
      type: "Research",
      status: "approved",
      submittedOn: "01-Sep-2024",
      feedback: {
        comments: [
          {
            reviewer: "John Doe",
            comment: "This is a good research topic.",
            date: "02-Sep-2024",
          },
          {
            reviewer: "Serena Williams",
            comment: "Please provide more examples.",
            date: "03-Sep-2024",
          },
        ],
        document: {
          name: "Research Paper",
          url: "https://example.com/research-paper",
        },
      },
    },
    
  ];

  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log("Edit submission:", id);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log("Delete submission:", id);
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

        <Button
          variant="contained"
          color="primary"
          disabled={submissions.length >= 2}
          startIcon={<UploadIcon />}
          sx={{ height: 45, borderRadius: 1.5 }}
          onClick={() => setOpenSubmissionDialog(true)}
        >
          Upload the file
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          mt: 1,
        }}
      >
        <Stack spacing={2}>
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              {...submission}
              onEdit={() => handleEdit(submission.id)}
              onDelete={() => handleDelete(submission.id)}
            />
          ))}
        </Stack>
      </Box>

      <SubmissionDialog
        open={openSubmissionDialog}
        onClose={() => setOpenSubmissionDialog(false)}
      />
    </Box>
  );
};

export default Dashboard;
