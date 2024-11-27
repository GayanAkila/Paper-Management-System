import { Box, Typography, Chip, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ReviewIcon from "@mui/icons-material/RateReview";
import { useMemo, useState } from "react";
import ReviewDialog from "./components/ReviewDialog";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { submissionsData } from "../../tempData";
import { useAppSelector } from "../../store/store";
import { Submission } from "../../store/slices/submissionSlice";

const FeedbackPanel = () => {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  const reviewerPapers = useMemo(
    () =>
      submissionsData.filter((submission) =>
        submission.reviewerEmail.includes(user?.email as string)
      ),
    [user?.email, submissionsData]
  );

  const onDownload = (id: string) => {
    console.log(`Downloading item with id: ${id}`);
  };

  const handleReviewClick = (submission: Submission) => {
    setSelectedSubmission(submission);
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
      field: "title",
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
      field: "submittedOn",
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
            onClick={() => handleReviewClick(params.row)}
            sx={{ color: (theme) => theme.palette.background.icon }}
          >
            <ReviewIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Feedback Panel
      </Typography>

      <Box
        sx={{
          height: "100%",
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
          rows={reviewerPapers}
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
      {selectedSubmission && user && (
        <ReviewDialog
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          onSubmit={handleReviewSubmit}
          submission={selectedSubmission}
          currentReviewer={user?.email}
        />
      )}
    </Box>
  );
};

export default FeedbackPanel;
