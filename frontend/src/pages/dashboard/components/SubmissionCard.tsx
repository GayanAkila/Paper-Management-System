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
  TextField,
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
import { Submission } from "../../../store/slices/submissionSlice";
import { formatDate } from "../../../utils/utils";
import StatusChip from "../../../components/StatusChip";
import { useAppSelector } from "../../../store/store";
import { SubmissionStatus } from "../../../types/types";

interface SubmissionCardProps {
  submission: Submission;
  onEdit?: () => void;
  onResubmit?: () => void;
  onDelete?: () => void;
}

const SubmissionCard = ({
  submission,
  onEdit,
  onDelete,
  onResubmit,
}: SubmissionCardProps) => {
  const { deadlines } = useAppSelector((state) => state.settings);
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
                width: 160,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                window.open(submission.fileUrl!, "_blank");
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              Download
            </MenuItem>
            {submission.status === "submitted" && (
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
            )}
            {submission.status === "needs revision" &&
              Date.parse(deadlines.resubmission) < Date.now() && (
                <MenuItem
                  onClick={() => {
                    onResubmit?.();
                    handleMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Resubmit
                </MenuItem>
              )}

            {submission.status === "submitted" && (
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
            )}
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
            <Typography color="text.secondary" sx={{ width: 150 }}>
              Author/s
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
            <Typography color="text.secondary" sx={{ width: 150 }}>
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
            <Typography color="text.secondary" sx={{ width: 150 }}>
              Status
            </Typography>
            <StatusChip status={submission.status} />
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
            <Typography color="text.secondary" sx={{ width: 150 }}>
              Submitted on
            </Typography>
            <Typography color="text.primary">
              {submission.createdAt ? formatDate(submission.createdAt) : "N/A"}
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
            <Typography color="text.secondary" sx={{ width: 150 }}>
              Feedback
            </Typography>
            {(submission.reviews?.comments?.length ?? 0 > 0) &&
            submission.status !== SubmissionStatus.reviewed ? (
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
                Not Avaliable Yet
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
                gap: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                Feedbacks
              </Typography>

              <StatusChip status={submission.status} />
            </Box>
            <IconButton onClick={handleFeedbackClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <List sx={{ mb: 2 }}>
            {submission.reviews?.comments.map((comment, index) => (
              <ListItem
                key={index}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderRadius: 1,
                  mb: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    justifyContent: "space-between",
                    width: "100%",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      alignContent: "center",
                      gap: 2,
                      p: 1,
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: (theme) =>
                        theme.palette.background.lightBackground,
                    }}
                  >
                    <Typography>{comment.reviewer}</Typography>
                    <Typography variant="body2">
                      {formatDate(comment.submittedAt)}
                    </Typography>
                  </Box>
                  <TextField
                    multiline
                    label="Comment"
                    value={comment.comments}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </Box>
                {comment.fileUrl && (
                  <Button
                    startIcon={<DocumentIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => window.open(comment.fileUrl!, "_blank")}
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
