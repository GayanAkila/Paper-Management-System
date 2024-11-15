import { Box, Typography, Chip, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import ReviewIcon from "@mui/icons-material/RateReview";
import { useState } from "react";
import ReviewDialog from "./components/ReviewDialog";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";

export const submissionsData = [
  {
    id: "1",
    topic: "AI in UX Design",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Pending",
  },
  {
    id: "2",
    topic: "Machine Learning Applications in Healthcare",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Pending",
  },
  {
    id: "3",
    topic: "Blockchain Technology in Supply Chain",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Pending",
  },
  {
    id: "4",
    topic: "Impact of IoT on Smart Cities",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Pending",
  },
  {
    id: "5",
    topic: "Data Analytics in Business Decision Making",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Approved with changes",
  },
  {
    id: "6",
    topic: "Cloud Computing Security Challenges",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Approved",
  },
  {
    id: "7",
    topic: "Ethics in Artificial Intelligence",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Pending",
  },
  {
    id: "8",
    topic: "Virtual Reality in Education",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Pending",
  },
  {
    id: "9",
    topic: "5G Networks and Their Applications",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Approved with changes",
  },
  {
    id: "10",
    topic: "Cybersecurity in Remote Work",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Approved",
  },
  {
    id: "11",
    topic: "Big Data Analytics in Healthcare",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Pending",
  },
  {
    id: "12",
    topic: "Digital Transformation Strategies",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Pending",
  },
  {
    id: "13",
    topic: "Quantum Computing Applications",
    type: "Research Paper",
    submissionDate: "01-Sep-2024",
    status: "Approved with changes",
  },
];

const FeedbackPanel = () => {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(
    null
  );

  const onDownload = (id: string) => {
    console.log(`Downloading item with id: ${id}`);
  };

  const handleReviewClick = (id: string, topic: string) => {
    setSelectedSubmission(topic);
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = (reviewData: {
    comment: string;
    decision: string;
    file?: File;
  }) => {
    console.log("Review submitted:", {
      submission: selectedSubmission,
      ...reviewData,
    });
    // Implement your review submission logic here
  };

  const getStatusChip = (status: string) => {
    const statusStyles = {
      Pending: {
        bgcolor: "#EEF2FF",
        color: "#818CF8",
        label: "Pending",
      },
      Approved: {
        bgcolor: "#ECFDF5",
        color: "#34D399",
        label: "Approved",
      },
      "Approved with changes": {
        bgcolor: "#FEF3C7",
        color: "#F59E0B",
        label: "Approved with changes",
      },
      Rejected: {
        bgcolor: "#FEE2E2",
        color: "#EF4444",
        label: "Rejected",
      },
    };

    const style =
      statusStyles[status as keyof typeof statusStyles] || statusStyles.Pending;

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

  const columns: GridColDef[] = [
    {
      field: "topic",
      headerName: "Topic",
      flex: 2,
      headerClassName: "datagrid-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "submissionDate",
      headerName: "Submission Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "datagrid-header",
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.value),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerAlign: "right",

      headerClassName: "datagrid-header",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            height: "100%",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            size="small"
            onClick={() => onDownload(params.row.id)}
            sx={{ color: (theme) => theme.palette.background.icon }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleReviewClick(params.row.id, params.row.topic)}
            sx={{ color: (theme) => theme.palette.background.icon }}
          >
            <ReviewIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h4">Feedback Panel</Typography>

      <Box
        sx={{
          height: "95%",
          overflowY: "hidden",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .datagrid-header": {
            backgroundColor: "#fff",
            color: (theme) => theme.palette.background.icon,
            fontWeight: 600,
          },
        }}
      >
        <DataGrid
          rows={submissionsData}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
          disableColumnMenu
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              sx: {
                "& .MuiButtonBase-root": {
                  color: (theme) => theme.palette.background.icon,
                },
              },
            },
          }}
        />
      </Box>

      <ReviewDialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
        submissionTopic={selectedSubmission || ""}
      />
    </Box>
  );
};

export default FeedbackPanel;
