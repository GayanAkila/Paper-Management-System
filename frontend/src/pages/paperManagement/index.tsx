import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Download as DownloadIcon,
  RateReview as ReviewIcon,
  PersonAdd as AssignReviewerIcon,
  ViewColumn as ColumnsIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import EditPaperDialog from "./components/EditPaperDialog";

interface PaperData {
  id: string;
  title: string;
  author: string;
  type: string;
  submissionDate: string;
  reviewers: string;
  status: string;
}

const Papers = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [assignReviewerDialogOpen, setAssignReviewerDialogOpen] =
    useState(false);
  const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null);

  const getStatusChip = (status: string) => {
    const statusStyles = {
      "Under Review": {
        bgcolor: "#E2F5FF",
        color: "#59A8D4",
        label: "Under Review",
      },
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

  const handleEdit = (paper: PaperData) => {
    setSelectedPaper(paper);
    setEditDialogOpen(true);
  };

  const handleDownload = (paperId: string) => {
    // Implement download logic
    console.log("Downloading paper:", paperId);
  };

  const handleReviewClick = (paper: PaperData) => {
    setSelectedPaper(paper);
    setReviewDialogOpen(true);
  };

  const handleAssignReviewer = (paper: PaperData) => {
    setSelectedPaper(paper);
    setAssignReviewerDialogOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Paper ID",
      flex: 0.7,
      headerClassName: "datagrid-header",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 2,
      headerClassName: "datagrid-header",
    },
    {
      field: "author",
      headerName: "Author",
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      headerClassName: "datagrid-header",
    },
    {
      field: "submissionDate",
      headerName: "Submission Date",
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "reviewers",
      headerName: "Reviewer(s)",
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      headerClassName: "datagrid-header",
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerClassName: "datagrid-header",
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Edit Paper">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              sx={{ color: "text.secondary" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Paper">
            <IconButton
              size="small"
              onClick={() => handleDownload(params.row.paperId)}
              sx={{ color: "text.secondary" }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Reviews">
            <IconButton
              size="small"
              onClick={() => handleReviewClick(params.row)}
              sx={{ color: "text.secondary" }}
            >
              <ReviewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign Reviewer">
            <IconButton
              size="small"
              onClick={() => handleAssignReviewer(params.row)}
              sx={{ color: "text.secondary" }}
            >
              <AssignReviewerIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const paperData = [
    {
      id: "P001",
      title: "The Impact of AI on Business...",
      author: "Gayan Akila",
      type: "Research",
      submissionDate: "20 Oct 2024",
      reviewers: "Harsha, Dilan",
      status: "Under Review",
      feedback: [
        {
          reviewer: "Harsha",
          decision: "Approved",
          comments: "Good work. Keep it up!",
        },
        {
          reviewer: "Dilan",
          decision: "Approved with changes",
          comments: "Good work. Please make the suggested changes.",
        },
      ],
    },
    {
      id: "P002",
      title: "The Impact of AI on Business...",
      author: "Gayan Akila",
      type: "Research",
      submissionDate: "20 Oct 2024",
      reviewers: "Harsha, Dilan",
      status: "Under Review",
    },
    {
      id: "P003",
      title: "The Impact of AI on Business...",
      author: "Gayan Akila",
      type: "Research",
      submissionDate: "20 Oct 2024",
      reviewers: "Harsha, Dilan",
      status: "Under Review",
    },
  ];

  return (
    <Box>
      <Typography variant="h4">Paper Management</Typography>

      {/* DataGrid */}
      <Box
        sx={{
          height: "calc(100vh - 220px)",
          width: "100%",
          "& .MuiDataGrid-root": {
            border: "none",
            backgroundColor: "white",
            borderRadius: 2,
          },
          "& .datagrid-header": {
            backgroundColor: "#F8FAFC",
            color: "#64748B",
            fontWeight: 600,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #F1F5F9",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "1px solid #E2E8F0",
          },
        }}
      >
        <DataGrid
          rows={paperData}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
          disableColumnMenu
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>
      {selectedPaper && (
        <EditPaperDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          paper={selectedPaper}
          onSubmit={function (paperData: {
            id: string;
            title: string;
            author: string;
            type: string;
            file?: File;
          }): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}

      {/* ReviewDialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} paper={selectedPaper} /> */}
      {/* AssignReviewerDialog open={assignReviewerDialogOpen} onClose={() => setAssignReviewerDialogOpen(false)} paper={selectedPaper} /> */}
    </Box>
  );
};

export default Papers;
