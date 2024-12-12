import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";
import AppreciationLetter from "./AppreciationLetter";
import logo from "../../../assets/images/logo.png";
import { LoadingButton } from "@mui/lab";
import { useAppSelector } from "../../../store/store";

interface PreviewLetterProps {
  open: boolean;
  onClose: () => void;
  reviewerData: any;
  handleSendLetter: (pdfBlobs: Blob[]) => Promise<void>;
}

const LetterPreview: React.FC<PreviewLetterProps> = ({
  open,
  onClose,
  reviewerData,
  handleSendLetter,
}) => {
  const { generateState } = useAppSelector((state) => state.letters);

  const generatePDF = async () => {
    const { pdf } = await import("@react-pdf/renderer");
    const letterDoc = (
      <AppreciationLetter
        reviewerName={reviewerData.name}
        reviewerId={reviewerData.id}
        reviewedPapers={reviewerData.reviewedSubmissions || []}
        logoUrl={logo}
      />
    );
    const blob = await pdf(letterDoc).toBlob();
    await handleSendLetter([blob]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: "calc(100vh - 64px)" },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Appreciation Letter Preview
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ flex: 1, overflow: "hidden", p: 2 }}>
        <Box sx={{ height: "100%" }}>
          <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
            <AppreciationLetter
              reviewerName={reviewerData?.name || ""}
              reviewerId={reviewerData?.id || ""}
              reviewedPapers={reviewerData?.reviewedSubmissions || []}
              logoUrl={logo}
            />
          </PDFViewer>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={generatePDF}
          loading={generateState === "loading"}
        >
          Generate & Send Letter
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default LetterPreview;
