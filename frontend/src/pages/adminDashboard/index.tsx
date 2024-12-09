import { Box, Stack, Typography } from "@mui/material";
import Notification from "./components/Notification";
import React, { useEffect, useMemo } from "react";
import StatCard from "./components/StatCard";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAllSubmissions } from "../../store/slices/submissionSlice";
import { fetchAllUsers } from "../../store/slices/userSlice";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const { allSubmissions } = useAppSelector((state) => state.submissions);
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      title: "Reviewer Assignment Required",
      message:
        "5 papers have been submitted and are awaiting reviewer assignments. Please allocate reviewers to ensure timely feedback.",
    },
    {
      id: 2,
      title: "Feedback Received from Reviewer",
      message:
        "Reviewer Dr. Shalinka Jyatilleke has submitted feedback for paper titled 'AI in UX Design.' Please review the comments and update the author.",
    },
    {
      id: 3,
      title: "Paper Rejected",
      message:
        "The paper titled 'Blockchain for Business' has been rejected by both reviewers. Please notify the author and remove the submission from the system.",
    },
  ]);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllSubmissions());
  }, []);

  const noOfSubmissions = useMemo(
    () => allSubmissions.length,
    [allSubmissions]
  );
  const noOfReviewers = useMemo(
    () => users.filter((u) => u.role === "reviewer").length,
    [users]
  );
  const noOfPendingAssignments = useMemo(
    () => allSubmissions.filter((s) => s.status === "submitted").length,
    [allSubmissions]
  );

  const handleCloseNotification = (notificationId: number) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          pt: 1,
        }}
      >
        <Typography variant="h4" fontWeight={500}>
          Dashboard
        </Typography>
      </Box>
      {/* Stats Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard value={noOfSubmissions} label="Total Submissions" />
        <StatCard value={noOfReviewers} label="Active Reviewers" />
        <StatCard value={noOfPendingAssignments} label="Pending Assignment" />
      </Box>

      {/* Notifications Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          mt: 1,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#0F172A" }}>
          System Notifications
        </Typography>
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              title={notification.title}
              message={notification.message}
              onClose={() => handleCloseNotification(notification.id)}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
