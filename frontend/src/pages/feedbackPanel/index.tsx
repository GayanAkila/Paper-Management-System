import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ReviewIcon from "@mui/icons-material/RateReview";
import DescriptionIcon from "@mui/icons-material/Description";
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
  Comment,
} from "../../store/slices/submissionSlice";
import { State } from "../../types/types";
import StatusChip from "../../components/StatusChip";

const FeedbackPanel = () => {
  const dispatch = useAppDispatch();
  const { allSubmissions, fetchState } = useAppSelector(
    (state) => state.submissions
  );
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  const renderUserReviewDecision = (params: GridRenderCellParams) => {
    if (!user || !params.value) {
      return <StatusChip status={"Not Reviewed"} />;
    }

    const reviews = Array.isArray(params.value.comments)
      ? params.value.comments
      : [];
    const userReview = reviews.find(
      (review: { reviewer: string }) => review.reviewer === user.email
    );

    if (!userReview) {
      return <StatusChip status={"Not Reviewed"} />;
    }

    const decision = userReview.decision;
    const hasAttachment = !!userReview.fileUrl;

    return (
      <Box>
        <StatusChip status={decision} />
        {/* <Chip
          label={decision}
          color={
            decision === "approve"
              ? "success"
              : decision === "reject"
              ? "error"
              : "warning"
          }
          variant="outlined"
        /> */}
        {/* {hasAttachment && (
          <Tooltip title="Review includes attachment">
            <DescriptionIcon fontSize="small" color="action" />
          </Tooltip>
        )} */}
      </Box>
    );
  };

  useEffect(() => {
    dispatch(fetchAllSubmissions());
  }, [dispatch]);

  const reviewerPapers = useMemo(() => {
    if (!user?.email || !Array.isArray(allSubmissions)) {
      return [];
    }

    return allSubmissions.filter((submission) =>
      Array.isArray(submission.reviewers)
        ? submission.reviewers.includes(user.email)
        : false
    );
  }, [user?.email, allSubmissions]);

  const onDownload = useCallback((url: string) => {
    if (url) window.open(url, "_blank");
  }, []);

  const handleReviewClick = useCallback((submission: Submission) => {
    setSelectedSubmission(submission);
    setReviewDialogOpen(true);
  }, []);

  const handleReviewSubmit = async (
    reviewData: Partial<Comment>,
    file?: File
  ) => {
    if (!selectedSubmission?.id || !user?.email) return;

    const formData = new FormData();
    formData.append("reviews", JSON.stringify(reviewData));
    // formData.append("decision", JSON.stringify(reviewData.decision));
    if (file) {
      formData.append("file", file);
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
        return Array.isArray(authors)
          ? authors.map((author) => author.name).join(", ")
          : "N/A";
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
      renderCell: (params) =>
        new Date(params.value as string).toLocaleDateString(),
    },
    {
      field: "reviews",
      headerName: "Decision",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "datagrid-header",
      renderCell: renderUserReviewDecision,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerAlign: "right",
      headerClassName: "datagrid-header",
      sortable: false,
      renderCell: (params: GridRenderCellParams<Submission>) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Tooltip title="Download Paper">
            <IconButton
              size="small"
              onClick={() =>
                params.row.fileUrl && onDownload(params.row.fileUrl)
              }
              sx={{ color: (theme) => theme.palette.background.icon }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Submit Review">
            <IconButton
              size="small"
              onClick={() => handleReviewClick(params.row)}
              sx={{ color: (theme) => theme.palette.background.icon }}
            >
              <ReviewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
