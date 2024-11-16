// src/pages/dashboard/Dashboard.tsx
import { useMemo, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../store/store";
import SubmissionDialog from "./components/SubmissionDialog";
import SubmissionCard from "./components/SubmissionCard";
import UploadIcon from "@mui/icons-material/Upload";
import { Author, Submission, SubmissionType } from "../../types/types";
import { submissionsData } from "../../tempData";

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedSubmission, setSelectedSubmission] = useState<
    Submission | undefined
  >();

  const userSubmissions = useMemo(
    () =>
      submissionsData.filter(
        (submission) => submission.studentEmail === user?.email
      ),
    [user?.email, submissionsData]
  );

  const handleSubmit = (data: {
    type: string;
    title: string;
    file?: File;
    authors: Author[];
  }) => {
    if (mode === "create") {
      // Handle creation
      console.log("Creating new submission:", data);
    } else {
      // Handle editing
      console.log("Updating submission:", data);
    }
  };

  const handleEdit = (submission: Submission) => {
    setSelectedSubmission(submission);
    setMode("edit");
    setDialogOpen(true);
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
          // disabled={userSubmissions.length >= 2}
          startIcon={<UploadIcon />}
          sx={{ height: 45, borderRadius: 1.5 }}
          onClick={() => {
            setMode("create");
            setSelectedSubmission(undefined);
            setDialogOpen(true);
          }}
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
          {userSubmissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onEdit={() => handleEdit(submission)}
              onDelete={() => handleDelete(submission.id)}
            />
          ))}
        </Stack>
      </Box>

      <SubmissionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={mode}
        initialData={selectedSubmission}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Dashboard;
