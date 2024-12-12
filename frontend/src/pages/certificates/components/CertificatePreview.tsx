import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Typography,
  Divider,
} from "@mui/material";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import CertificateDocument from "./CertificateDocument";
import logo from "../../../assets/images/logo.png";
import { LoadingButton } from "@mui/lab";
import { useAppSelector } from "../../../store/store";

interface CertificatePreviewProps {
  open: boolean;
  onClose: () => void;
  submissionData: any;
  handleSendCertificate: (pdfBlobs: Blob[]) => Promise<void>;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  open,
  onClose,
  submissionData,
  handleSendCertificate,
}) => {
  const [currentAuthorIndex, setCurrentAuthorIndex] = useState(0);
  const authors = submissionData?.authors || [];

  const { sendState } = useAppSelector((state) => state.certificate);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentAuthorIndex(newValue);
  };

  const generatePDFForCurrentAuthor = async (author: any) => {
    try {
      const pdfDoc = (
        <CertificateDocument
          authorName={author.name}
          submissionType={submissionData.type}
          submissionId={submissionData.id}
          logoUrl={logo}
        />
      );
      const blob = await pdf(pdfDoc).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  };

  const handleGenerateAndSend = async () => {
    const pdfBlobs: Blob[] = [];

    for (const author of authors) {
      const blob = await generatePDFForCurrentAuthor(author);
      if (blob) {
        pdfBlobs.push(blob);
      }
    }

    if (pdfBlobs.length > 0) {
      await handleSendCertificate(pdfBlobs);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          height: "calc(100vh - 64px)",
          maxWidth: "90vw",
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Certificate Preview
          </Typography>
          <Tabs
            value={currentAuthorIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {authors.map((author: any, index: number) => (
              <Tab
                key={index}
                label={author.name}
                id={`certificate-tab-${index}`}
              />
            ))}
          </Tabs>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, height: "calc(100% - 200px)" }}>
        <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
          <CertificateDocument
            authorName={authors[currentAuthorIndex]?.name || "Participant Name"}
            submissionType={submissionData?.type || ""}
            submissionId={submissionData?.id || "CERT-ID"}
            logoUrl={logo}
          />
        </PDFViewer>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        {submissionData?.certificatesEmailed ? (
          <Button variant="contained" color="primary" disabled>
            Certificates Sent
          </Button>
        ) : (
          <LoadingButton
            loading={sendState === "loading"}
            onClick={handleGenerateAndSend}
            variant="contained"
            color="primary"
          >
            Generate & Send Certificates
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CertificatePreview;
