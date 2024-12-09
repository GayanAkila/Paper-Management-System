import { Box, Typography, Chip, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ReviewIcon from "@mui/icons-material/RateReview";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReviewDialog from "./components/ReviewDialog";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  addReviews,
  fetchAllSubmissions,
  Submission,
} from "../../store/slices/submissionSlice";
import { State } from "../../types/types";

const FeedbackPanel = () => {
  const dispatch = useAppDispatch();
  const { allSubmissions, fetchState } = useAppSelector(
    (state) => state.submissions
  );
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAllSubmissions());
  }, []);

  const reviewerPapers = useMemo(() => {
    if (!user?.email || !Array.isArray(allSubmissions)) {
      console.error("User email or allSubmissions array is not defined");
      return [];
    }

    const filteredSubmissions = allSubmissions.filter((submission) => {
      if (!Array.isArray(submission.reviewers)) {
        console.error(
          "Reviewers field is not an array in submission:",
          submission
        );
        return false;
      }
      return submission.reviewers.includes(user.email);
    });
    return filteredSubmissions;
  }, [user?.email, allSubmissions]);

  const onDownload = (paper: Partial<Submission>) => {
    window.open(paper.fileUrl!, "_blank");
  };

  const handleReviewClick = useCallback(
    (submission: Submission) => {
      setSelectedSubmission(submission);
      setReviewDialogOpen(true);
    },
    [selectedSubmission]
  );

  const handleReviewSubmit = async (reviewData: {
    comment: string;
    decision: string;
    file?: File;
  }) => {
    if (!selectedSubmission?.id || !user?.email) return;

    const formData = new FormData();
    formData.append("comments", reviewData.comment);
    formData.append("decision", reviewData.decision);

    if (reviewData.file) {
      formData.append("file", reviewData.file);
    }

    try {
      await dispatch(
        addReviews({
          id: selectedSubmission.id,
          reviews: formData,
        })
      ).unwrap();
      setReviewDialogOpen(false);
      dispatch(fetchAllSubmissions());
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const getStatusChip = (status: string) => {
    const statusStyles = {
      "in review": {
        bgcolor: "#EEF2FF",
        color: "#818CF8",
        label: "Pending",
      },
      approved: {
        bgcolor: "#ECFDF5",
        color: "#34D399",
        label: "Approved",
      },
      "needs revision": {
        bgcolor: "#FEF3C7",
        color: "#F59E0B",
        label: "Approved with changes",
      },
      rejected: {
        bgcolor: "#FEE2E2",
        color: "#EF4444",
        label: "Rejected",
      },
    };

    const style =
      statusStyles[status as keyof typeof statusStyles] ||
      statusStyles["in review"];

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
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "createdAt",
      headerName: "Submission Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "datagrid-header",
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.value as string);
        return date.toLocaleDateString();
      },
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
            onClick={() => onDownload(params.row)}
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
      <Typography variant="h4" fontWeight={500} sx={{ mb: 1 }}>
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
          loading={fetchState === State.loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
          disableColumnMenu
          getRowId={(row) => row.id}
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
        />
      )}
    </Box>
  );
};

export default FeedbackPanel;
