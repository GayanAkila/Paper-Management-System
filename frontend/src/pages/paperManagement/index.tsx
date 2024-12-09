import React, { useEffect, useMemo, useState } from "react";
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
  Add,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  fetchAllSubmissions,
  Submission,
  editSubmission,
  addReviewers,
} from "../../store/slices/submissionSlice";
import SubmissionDialog from "../dashboard/components/SubmissionDialog";
import { enqueueSnackbarMessage } from "../../store/slices/commonSlice";
import { fetchAllUsers } from "../../store/slices/userSlice";
import AddReviewerDialog from "./components/AddReviewerDialog";
import ViewReviewDialog from "./components/ViewReviewDialog";
import { formatDate } from "../../utils/utils";
import StatusChip from "../../components/StatusChip";

const Papers = () => {
  const dispatch = useAppDispatch();
  const { allSubmissions, fetchState } = useAppSelector(
    (state) => state.submissions
  );
  const { users } = useAppSelector((state) => state.user);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [assignReviewerDialogOpen, setAssignReviewerDialogOpen] =
    useState(false);
  const [selectedPaper, setSelectedPaper] =
    useState<Partial<Submission> | null>(null);

  const reviwersList = useMemo(
    () => users.filter((user) => user.role === "reviewer"),
    [users]
  );

  useEffect(() => {
    dispatch(fetchAllSubmissions());
    dispatch(fetchAllUsers());
  }, []);

  const handleEdit = (paper: Partial<Submission>) => {
    setSelectedPaper(paper);
    setDialogOpen(true);
  };

  const handleDownload = (paper: Partial<Submission>) => {
    window.open(paper.fileUrl!, "_blank");
  };

  const handleReviewClick = (paper: Partial<Submission>) => {
    if (paper.reviews?.comments !== undefined) {
      setSelectedPaper(paper);
      setReviewDialogOpen(true);
    } else {
      dispatch(
        enqueueSnackbarMessage({
          message: "No reviews available",
          type: "warning",
        })
      );
    }
  };

  const handleAssignReviewer = (paper: Partial<Submission>) => {
    setSelectedPaper(paper);
    setAssignReviewerDialogOpen(true);
  };

  // Handle form submission (edit)
  const handleSubmit = async (data: Partial<Submission>, file?: File) => {
    const formData = new FormData();
    formData.append("submission", JSON.stringify(data));
    if (file) {
      formData.append("file", file);
    }

    try {
      if (selectedPaper && selectedPaper.id) {
        dispatch(editSubmission({ id: selectedPaper.id, formData }));
      }
    } catch (error) {
      dispatch(
        enqueueSnackbarMessage({ message: "Failed to submit", type: "error" })
      );
    } finally {
      setDialogOpen(false);
      dispatch(fetchAllSubmissions());
    }
  };

  const handleReviewerSubmit = async (reviewers: string[]) => {
    if (selectedPaper && selectedPaper.id) {
      dispatch(addReviewers({ id: selectedPaper.id, reviewers })).then(() => {
        dispatch(fetchAllSubmissions());
      });
    }
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
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "authors",
      headerName: "Author/s",
      flex: 1,
      headerClassName: "datagrid-header",
      renderCell: (params) => {
        const authors = params.value;
        const authorNames = Array.isArray(authors)
          ? authors.map((author) => author.name).join(", ")
          : "N/A";

        return <>{authorNames}</>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      align: "center",
      headerAlign: "center",
      flex: 0.8,
      headerClassName: "datagrid-header",
      renderCell: (params) => {
        const type = params.value as string;
        if (type === "Research Paper") {
          return (
            <Chip
              variant="outlined"
              label="Research"
              color="primary"
              size="small"
              sx={{ width: 100 }}
            />
          );
        }
        if (type === "Project") {
          return (
            <Chip
              variant="outlined"
              label="Project"
              color="secondary"
              size="small"
              sx={{ width: 100 }}
            />
          );
        }
      },
    },
    {
      field: "createdAt",
      headerName: "Submitted Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "datagrid-header",
      renderCell: (params) => {
        const value = params.value as string;
        return <>{formatDate(value)}</>;
      },
    },
    {
      field: "reviewers",
      headerName: "Reviewer(s)",
      flex: 1,
      headerClassName: "datagrid-header",
      renderCell: (params) => {
        const reviewers = params.value;
        const reviewerNames = Array.isArray(reviewers)
          ? reviewers.map((reviewer) => reviewer).join(", ")
          : "N/A";

        return <>{reviewerNames}</>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      flex: 0.8,
      headerClassName: "datagrid-header",
      renderCell: (params) => {
        return <StatusChip status={params.value} />;
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerAlign: "right",
      align: "right",
      headerClassName: "datagrid-header",
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tooltip title="Edit Paper">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              sx={{
                color: (theme) => theme.palette.background.icon,
                "&:hover": { color: "primary.main" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Paper">
            <IconButton
              size="small"
              onClick={() => handleDownload(params.row)}
              sx={{
                color: (theme) => theme.palette.background.icon,
                "&:hover": { color: "primary.main" },
              }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Reviews">
            <IconButton
              size="small"
              onClick={() => handleReviewClick(params.row)}
              sx={{
                color: (theme) => theme.palette.background.icon,
                "&:hover": { color: "primary.main" },
              }}
            >
              <ReviewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign Reviewer">
            <IconButton
              size="small"
              onClick={() => handleAssignReviewer(params.row)}
              sx={{
                color: (theme) => theme.palette.background.icon,
                "&:hover": { color: "primary.main" },
              }}
            >
              <AssignReviewerIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={500} mb={2}>
        Paper Management
      </Typography>

      {/* DataGrid */}
      <Box
        sx={{
          height: "calc(100vh - 200px)",
          width: "100%",
          "& .MuiDataGrid-root": {
            border: "none",
            backgroundColor: "white",
            borderRadius: 2,
          },
          "& .datagrid-header": {
            backgroundColor: "#fff",
            color: "#64748B",
            fontWeight: 600,
          },

          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <DataGrid
          rows={allSubmissions}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          loading={fetchState === "loading"}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
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
        <>
          <SubmissionDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            mode={"edit"}
            submission={selectedPaper}
            onSubmit={handleSubmit}
          />
          <AddReviewerDialog
            open={assignReviewerDialogOpen}
            onClose={() => setAssignReviewerDialogOpen(false)}
            reviewersList={reviwersList.map((reviewer) => reviewer.email)}
            onSubmit={handleReviewerSubmit}
            paper={selectedPaper}
          />
        </>
      )}
      {selectedPaper && (
        <ViewReviewDialog
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          paper={selectedPaper}
        />
      )}
    </Box>
  );
};

export default Papers;
