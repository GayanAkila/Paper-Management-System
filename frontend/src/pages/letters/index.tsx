import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import {
  Description as LetterIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { uploadAppreciationLetter } from "../../store/slices/letterSlice";
import { fetchAllUsers } from "../../store/slices/userSlice";
import { State } from "../../types/types";
import LetterPreview from "./components/LetterPreview";

const Letters = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const { generateState } = useAppSelector((state) => state.letters);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const reviewers = users.filter((user) => user.role === "reviewer");

  const handleSendLetter = async (pdfBlobs: Blob[]) => {
    if (!selectedReviewer) return;

    const formData = new FormData();
    pdfBlobs.forEach((blob, index) => {
      formData.append(
        "file",
        new File([blob], `letter_${index}.pdf`, { type: "application/pdf" })
      );
    });

    try {
      await dispatch(
        uploadAppreciationLetter({
          reviewerId: selectedReviewer.id,
          file: formData,
        })
      ).unwrap();

      dispatch(fetchAllUsers());
      setPreviewOpen(false);
    } catch (error) {
      console.error("Error processing letter:", error);
    }
  };

  const handlePreviewLetter = (reviewer: any) => {
    setSelectedReviewer(reviewer);
    setPreviewOpen(true);
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
      headerName: "Email Status",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      headerClassName: "datagrid-header",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Sent" : "Not Sent"}
          color={params.value ? "success" : "default"}
          variant="filled"
          size="small"
          sx={{ minWidth: 80 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      headerAlign: "right",
      align: "right",
      headerClassName: "datagrid-header",
      renderCell: (params) => {
        const letterSent = params.row.letterEmailed;

        return (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignContent: "center",
              alignItems: "center",

              justifyContent: "flex-end",
            }}
          >
            {letterSent ? (
              <Tooltip title="View Letter">
                <IconButton
                  size="small"
                  onClick={() => handlePreviewLetter(params.row)}
                >
                  <PreviewIcon
                    sx={{ color: (theme) => theme.palette.background.icon }}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Generate Letter">
                <IconButton
                  size="small"
                  onClick={() => handlePreviewLetter(params.row)}
                  disabled={generateState === State.loading}
                >
                  <LetterIcon
                    sx={{ color: (theme) => theme.palette.background.icon }}
                  />
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
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <DataGrid
          rows={reviewers}
          columns={columns}
          loading={generateState === State.loading}
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

      {selectedReviewer && (
        <LetterPreview
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          reviewerData={selectedReviewer}
          handleSendLetter={handleSendLetter}
        />
      )}
    </Box>
  );
};

export default Letters;
