import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Description as LetterIcon,
  Email as EmailIcon,
  Preview as PreviewIcon,
  Description,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  generateAppreciationLetter,
  sendAppreciationLetter,
} from "../../store/slices/letterSlice";
import { fetchAllUsers } from "../../store/slices/userSlice";
import { State } from "../../types/types";

interface ViewLetterDialogProps {
  open: boolean;
  onClose: () => void;
  letterUrl: string;
  reviewerName: string;
}

const ViewLetterDialog: React.FC<ViewLetterDialogProps> = ({
  open,
  onClose,
  letterUrl,
  reviewerName,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Typography variant="h6" fontWeight={600}>
        {reviewerName}'s Appreciation Letter
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => window.open(letterUrl, "_blank")}
          startIcon={<Description />}
          fullWidth
          sx={{ textTransform: "none" }}
        >
          View Letter
        </Button>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} sx={{ textTransform: "none" }}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

const Letters = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const { letterUrls, generateState, sendState } = useAppSelector(
    (state) => state.letters
  );

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const reviewers = users.filter((user) => user.role === "reviewer");

  const handleGenerateLetter = async (reviewerId: string) => {
    try {
      await dispatch(generateAppreciationLetter(reviewerId)).unwrap();
      dispatch(fetchAllUsers());
    } catch (error) {
      console.error("Error generating letter:", error);
    }
  };

  const handleSendLetter = async (reviewerId: string) => {
    try {
      await dispatch(sendAppreciationLetter(reviewerId)).unwrap();
      dispatch(fetchAllUsers());
    } catch (error) {
      console.error("Error sending letter:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "letterEmailed",
      headerName: "Send Status",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      headerClassName: "datagrid-header",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Sent" : "Not Sent"}
          color={params.value ? "success" : "default"}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "right",
      align: "right",
      headerClassName: "datagrid-header",
      renderCell: (params) => {
        const hasLetter = params.row.appreciationLetterUrl;
        const letterSent = params.row.letterEmailed;

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            {hasLetter ? (
              <>
                <Tooltip title="View Letter">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedReviewer({
                        id: params.row.id,
                        name: params.row.name,
                      });
                      setViewDialogOpen(true);
                    }}
                  >
                    <PreviewIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download Letter">
                  <IconButton
                    size="small"
                    onClick={() =>
                      window.open(params.row.appreciationLetterUrl, "_blank")
                    }
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>

                {!letterSent && (
                  <Tooltip title="Send Letter via Email">
                    <IconButton
                      size="small"
                      onClick={() => handleSendLetter(params.row.id)}
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ) : (
              <Tooltip title="Generate Letter">
                <IconButton
                  size="small"
                  onClick={() => handleGenerateLetter(params.row.id)}
                  disabled={generateState === State.loading}
                >
                  <LetterIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={500} mb={3}>
        Appreciation Letters
      </Typography>

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
            backgroundColor: "#fff",
            color: "#64748B",
            fontWeight: 600,
          },
        }}
      >
        <DataGrid
          rows={reviewers}
          columns={columns}
          loading={
            generateState === State.loading || sendState === State.loading
          }
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          disableColumnMenu
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>

      {selectedReviewer.id && letterUrls[selectedReviewer.id] && (
        <ViewLetterDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          letterUrl={letterUrls[selectedReviewer.id]}
          reviewerName={selectedReviewer.name}
        />
      )}
    </Box>
  );
};

export default Letters;
