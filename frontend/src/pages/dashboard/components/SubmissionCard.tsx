// src/components/SubmissionCard/SubmissionCard.tsx
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
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface SubmissionCardProps {
  id: string;
  title: string;
  type: "Research" | "Project";
  status: "Pending" | "Approved" | "Rejected";
  submittedOn: string;
  feedback?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SubmissionCard = ({
  id,
  title,
  type,
  status,
  submittedOn,
  feedback = "Not yet reviewed",
  onEdit,
  onDelete,
}: SubmissionCardProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#EFF6FF";
      case "approved":
        return "#F0FDF4";
      case "rejected":
        return "#FEF2F2";
      default:
        return "#EFF6FF";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#2563EB";
      case "approved":
        return "#16A34A";
      case "rejected":
        return "#DC2626";
      default:
        return "#2563EB";
    }
  };

  return (
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
          <Typography color="text.secondary" fontStyle="italic">
            {feedback}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default SubmissionCard;
