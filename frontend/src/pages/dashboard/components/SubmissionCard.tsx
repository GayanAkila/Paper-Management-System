import React from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Paper,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Link,
  List,
  ListItem,
  Button,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { Submission } from "../../../types/types";

interface SubmissionCardProps {
  submission: Submission;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SubmissionCard = ({
  submission,
  onEdit,
  onDelete,
}: SubmissionCardProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFeedbackClick = () => {
    setFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#EDEDFF";
      case "approved":
        return "#DEF8EE";
      case "rejected":
        return "rgba(28, 28, 28, 0.05)";
      case "approved with changes":
        return "#FFFBD4";
      case "under review":
        return "#E2F5FF";
      default:
        return "#EFF6FF";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#8A8CD9";
      case "approved":
        return "#4AA785";
      case "rejected":
        return "rgba(28, 28, 28, 0.4)";
      case "approved with changes":
        return "#FFC555";
      case "under review":
        return "#59A8D4";
      default:
        return "#EFF6FF";
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "#F6F9FE",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              mb: 3,
              flex: 1,
            }}
          >
            {submission.title}
          </Typography>

          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{ color: "#64748B" }}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                width: 140,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                window.open(submission.document!, "_blank");
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              Download
            </MenuItem>
            <MenuItem
              onClick={() => {
                onEdit?.();
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDelete?.();
                handleMenuClose();
              }}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={0.5}>
          {/* Authors Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              borderRadius: 1,
              p: 1,
              bgcolor: "white",
            }}
          >
            <Typography color="text.secondary" sx={{ width: 100 }}>
              Authors
            </Typography>
            <Stack spacing={1} display={"flex"} direction={"row"}>
              {submission.authors.map((author, index) => (
                <Tooltip key={index} title={author.email} arrow>
                  <Chip
                    size="small"
                    key={index}
                    avatar={
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: "0.75rem",
                          bgcolor: "#fff",
                        }}
                      >
                        {author.name.charAt(0)}
                      </Avatar>
                    }
                    label={
                      <Typography variant="body2">{author.name}</Typography>
                    }
                    sx={{ margin: 0.5 }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Box>

          {/* Type Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 1,
              p: 1,
              bgcolor: "white",
            }}
          >
            <Typography color="text.secondary" sx={{ width: 100 }}>
              Type
            </Typography>
            <Typography color="text.primary" fontWeight={500}>
              {submission.type}
            </Typography>
          </Box>

          {/* Status Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 1,
              p: 1,
              bgcolor: "white",
            }}
          >
            <Typography color="text.secondary" sx={{ width: 100 }}>
              Status
            </Typography>
            <Chip
              label={submission.status}
              sx={{
                bgcolor: getStatusColor(submission.status),
                color: getStatusTextColor(submission.status),
                fontWeight: 500,
                height: 24,
              }}
            />
          </Box>

          {/* Submission Date */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 1,
              p: 1,
              bgcolor: "white",
            }}
          >
            <Typography color="text.secondary" sx={{ width: 100 }}>
              Submitted on
            </Typography>
            <Typography color="text.primary">
              {submission.submittedOn}
            </Typography>
          </Box>

          {/* Feedback Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 1,
              p: 1,
              bgcolor: "white",
            }}
          >
            <Typography color="text.secondary" sx={{ width: 100 }}>
              Feedback
            </Typography>
            {submission.feedback?.comments?.length ?? 0 > 0 ? (
              <Link
                component="button"
                onClick={handleFeedbackClick}
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                View Feedback
                <OpenInNewIcon fontSize="small" />
              </Link>
            ) : (
              <Typography color="text.secondary" fontStyle="italic">
                Not yet reviewed
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackOpen}
        onClose={handleFeedbackClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                Reviewer Feedback
              </Typography>
            </Box>
            <IconButton onClick={handleFeedbackClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <List sx={{ mb: 2 }}>
            {submission.feedback?.comments.map((comment, index) => (
              <ListItem
                key={index}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  bgcolor: (theme) => theme.palette.background.default,
                  borderRadius: 1,
                  mb: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.75rem",
                        bgcolor: "primary.main",
                      }}
                    >
                      {comment.reviewer.charAt(0)}
                    </Avatar>
                    {comment.reviewer}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {comment.date}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {comment.comment}
                </Typography>
                {comment.document && (
                  <Button
                    startIcon={<DocumentIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => window.open(comment.document!, "_blank")}
                    sx={{ textTransform: "none" }}
                  >
                    View Review Document
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubmissionCard;
