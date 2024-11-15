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
  ListItemText,
  Button,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Feedback, Status } from "../../../types/types";

interface SubmissionCardProps {
  id: string;
  title: string;
  type: "Research" | "Project";
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "approved with changes"
    | "under review";
  submittedOn: string;
  feedback?: {
    comments: Feedback[];
    document?: {
      name: string;
      url: string;
    };
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

const SubmissionCard = ({
  id,
  title,
  type,
  status,
  submittedOn,
  feedback,
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
      case Status.pending:
        return "#EDEDFF";
      case Status.approved:
        return "#DEF8EE";
      case Status.rejected:
        return "rgba(28, 28, 28, 0.05)";
      case Status.approvedWithChanges:
        return "#FFFBD4";
      case Status.underReview:
        return "#E2F5FF";
      default:
        return "#EFF6FF";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case Status.pending:
        return "#8A8CD9";
      case Status.approved:
        return "#4AA785";
      case Status.rejected:
        return "rgba(28, 28, 28, 0.4)";
      case Status.approvedWithChanges:
        return "#FFC555";
      case Status.underReview:
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
            {title}
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
                width: 128,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
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
              {type}
            </Typography>
          </Box>

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
              label={status}
              sx={{
                bgcolor: getStatusColor(status),
                color: getStatusTextColor(status),
                fontWeight: 500,
                height: 24,
              }}
            />
          </Box>

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
            <Typography color="text.primary">{submittedOn}</Typography>
          </Box>

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
            {feedback?.comments ? (
              <Link
                component="button"
                onClick={handleFeedbackClick}
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                View Feedback
                <OpenInNewIcon
                  color="inherit"
                  fontSize="small"
                  sx={{ ml: 1 }}
                />
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
            }}
          >
            <Typography variant="h6">Reviewer Feedback</Typography>
            <IconButton onClick={handleFeedbackClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List sx={{ mb: 2 }}>
            {feedback?.comments.map((comment, index) => (
              <ListItem
                key={index}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  mb: 1,
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
                  <Typography variant="subtitle2" color="primary">
                    {comment.reviewer}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {comment.date}
                  </Typography>
                </Box>
                <Typography variant="body2">{comment.comment}</Typography>
              </ListItem>
            ))}
          </List>

          {feedback?.document && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <DocumentIcon color="primary" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">
                  {feedback.document.name}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => window.open(feedback?.document?.url, "_blank")}
              >
                View
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubmissionCard;
