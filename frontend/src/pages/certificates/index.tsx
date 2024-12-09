import { useEffect, useState } from "react";
import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import {
  Description as CertificateIcon,
  Email as EmailIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAllSubmissions } from "../../store/slices/submissionSlice";
import {
  generateCertificate,
  sendCertificateEmails,
} from "../../store/slices/certificateSlice";
import { State, SubmissionStatus } from "../../types/types";
import ViewCertificatesDialog from "./components/ViewCertificatesDialog";

const Certificates = () => {
  const dispatch = useAppDispatch();
  const { allSubmissions, fetchState } = useAppSelector(
    (state) => state.submissions
  );
  const { generateState, sendState } = useAppSelector(
    (state) => state.certificate
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState<any[]>([]);

  // Fetch all submissions
  useEffect(() => {
    dispatch(fetchAllSubmissions());
  }, [dispatch]);

  // Filter approved submissions
  const approvedSubmissions = allSubmissions.filter(
    (submission) =>
      submission.status === SubmissionStatus.approved ||
      submission.status === SubmissionStatus.needsRevision
  );

  // Generate certificate for a submission
  const handleGenerateCertificate = async (submissionId: string) => {
    try {
      await dispatch(generateCertificate(submissionId)).unwrap();
      dispatch(fetchAllSubmissions());
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  // Send certificate emails for a submission
  const handleSendEmails = async (submissionId: string) => {
    try {
      await dispatch(sendCertificateEmails(submissionId)).unwrap();
      dispatch(fetchAllSubmissions());
    } catch (error) {
      console.error("Error sending emails:", error);
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
        const authors = params.row.authors;
        const authorNames = Array.isArray(authors)
          ? authors.map((author: any) => author.name).join(", ")
          : "N/A";
        return <>{authorNames}</>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      headerClassName: "datagrid-header",
      renderCell: (params) => (
        <Chip
          label={params.value === "Research Paper" ? "Research" : "Project"}
          color={params.value === "Research Paper" ? "primary" : "secondary"}
          variant="outlined"
          size="small"
          sx={{ minWidth: 100 }}
        />
      ),
    },
    {
      field: "certificatesEmailed",
      headerName: "Email Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "datagrid-header",
      renderCell: (params) => {
        const emailsSent = params.value;
        return (
          <Chip
            label={emailsSent ? "Sent" : "Not Sent"}
            color={emailsSent ? "success" : "secondary"}
            variant="filled"
            size="small"
            sx={{ minWidth: 80 }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      headerAlign: "right",
      align: "right",
      sortable: false,
      headerClassName: "datagrid-header",
      renderCell: (params) => {
        const submission = params.row;
        const hasCertificates = submission.certificateUrls?.length > 0;
        const emailsSent = submission.certificatesEmailed;

        return (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {hasCertificates ? (
              <>
                {!emailsSent && (
                  <Tooltip title="Send Certificates via Email">
                    <IconButton
                      size="small"
                      onClick={() => handleSendEmails(submission.id)}
                    >
                      <EmailIcon
                        sx={{
                          color: (theme) => theme.palette.background.icon,
                          "&:hover": { color: "primary.main" },
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="View Certificates">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedCertificates(submission.certificateUrls);
                      setViewDialogOpen(true);
                    }}
                  >
                    <PreviewIcon
                      sx={{
                        color: (theme) => theme.palette.background.icon,
                        "&:hover": { color: "primary.main" },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Generate Certificate">
                <IconButton
                  size="small"
                  onClick={() => handleGenerateCertificate(submission.id)}
                  disabled={generateState === State.loading}
                >
                  <CertificateIcon
                    sx={{
                      color: (theme) => theme.palette.background.icon,
                      "&:hover": { color: "primary.main" },
                    }}
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
      <Typography variant="h4" fontWeight={500} mb={2}>
        Certificates
      </Typography>

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
        }}
      >
        <DataGrid
          rows={approvedSubmissions}
          columns={columns}
          loading={
            fetchState === State.loading ||
            sendState === State.loading ||
            generateState === State.loading
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

      <ViewCertificatesDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        certificates={selectedCertificates}
      />
    </Box>
  );
};

export default Certificates;
