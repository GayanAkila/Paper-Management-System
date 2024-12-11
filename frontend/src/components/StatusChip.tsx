import { Chip } from "@mui/material";

interface StatusChipProps {
  status: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const statusStyles = {
    "in review": {
      bgcolor: "#EEF2FF",
      color: "#818CF8",
      label: "Under Review",
    },
    reviewed: {
      bgcolor: "#E2F5FF",
      color: "#59A8D4",
      label: "Reviewed",
    },
    submitted: {
      bgcolor: "#F3F4F6",
      color: "#6B7280",
      label: "Submitted",
    },
    approved: {
      bgcolor: "#ECFDF5",
      color: "#34D399",
      label: "Approved",
    },
    approve: {
      bgcolor: "#ECFDF5",
      color: "#34D399",
      label: "Approved",
    },
    "needs revision": {
      bgcolor: "#FEF3C7",
      color: "#F59E0B",
      label: "Needs Revision",
    },
    Rejected: {
      bgcolor: "#FEE2E2",
      color: "#EF4444",
      label: "Rejected",
    },
    rejected: {
      bgcolor: "#FEE2E2",
      color: "#EF4444",
      label: "Rejected",
    },
    default: {
      bgcolor: "#F3F4F6",
      color: "#6B7280",
      label: "Unknown",
    },
    "Not Reviewed": {
      bgcolor: "#F3F4F6",
      color: "#6B7280",
      label: "Not Reviewed",
    },
    reject: {
      bgcolor: "#FEE2E2",
      color: "#EF4444",
      label: "Reject",
    },
  };

  const style =
    statusStyles[status as keyof typeof statusStyles] || statusStyles.submitted;

  return (
    <Chip
      label={style.label}
      sx={{
        bgcolor: style.bgcolor,
        color: style.color,
        height: "24px",
        fontSize: "0.75rem",
        fontWeight: 500,
        "& .MuiChip-label": {
          px: 1.5,
        },
      }}
    />
  );
};

export default StatusChip;
