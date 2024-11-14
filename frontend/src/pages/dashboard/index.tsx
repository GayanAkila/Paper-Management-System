// src/pages/dashboard/Dashboard.tsx
import React, { useState } from "react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../store/store";
import { CloudUpload } from "@mui/icons-material";
import SubmissionDialog from "./components/SubmissionDialog";
import SubmissionCard from "./components/SubmissionCard";

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
      status: "Pending",
      submittedOn: "01-Sep-2024",
    },
    {
      id: "2",
      title: "The Impact of AI on Business Decision Making",
      type: "Research",
      status: "Pending",
      submittedOn: "01-Sep-2024",
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
    <Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUpload />}
          sx={{ height: 45, borderRadius: 1.5 }}
          onClick={() => setOpenSubmissionDialog(true)}
        >
          Upload the file
        </Button>
      </Box>

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

      <SubmissionDialog
        open={openSubmissionDialog}
        onClose={() => setOpenSubmissionDialog(false)}
      />
    </Box>
  );
};

export default Dashboard;
