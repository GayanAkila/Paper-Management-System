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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../assets/images/logo.png";

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
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const authors = submissionData?.authors || [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentAuthorIndex(newValue);
  };

  const generatePDFForCurrentAuthor = async () => {
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 1,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "px", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        return pdf.output("blob");
      } catch (error) {
        console.error("Error generating PDF:", error);
        return null;
      }
    }
    return null;
  };

  const handleGenerateAndSend = async () => {
    const pdfBlobs: Blob[] = [];

    for (let i = 0; i < authors.length; i++) {
      setCurrentAuthorIndex(i);
      // Wait for state update and re-render
      await new Promise((resolve) => setTimeout(resolve, 100));

      const blob = await generatePDFForCurrentAuthor();
      if (blob) {
        pdfBlobs.push(blob);
      }
    }

    await handleSendCertificate(pdfBlobs);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "auto",
          width: "auto",
          margin: "20px",
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
      <DialogContent>
        <div ref={certificateRef}>
          <div
            style={{
              width: "1123px",
              height: "794px",
              margin: 0,
              padding: "30px",
              boxSizing: "border-box",
              fontFamily: "'Montserrat', sans-serif",
              color: "#1a1a1a",
              background: "#fff",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                border: "25px solid #1976d2",
                padding: "40px",
                boxSizing: "border-box",
                position: "relative",
                backgroundColor: "#fff",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  alignContent: "center",
                  justifyItems: "center",
                  marginBottom: "20px",
                  position: "relative",
                }}
              >
                <img
                  src={logo}
                  alt="BISSS Logo"
                  style={{
                    width: "180px",
                    alignContent: "center",
                    height: "auto",
                    marginBottom: "15px",
                    objectFit: "contain",
                  }}
                />
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "48px",
                    color: "#1976d2",
                    margin: 0,
                    letterSpacing: "2px",
                  }}
                >
                  Certificate of Participation
                </h1>
                <p
                  style={{
                    fontSize: "24px",
                    color: "#666",
                    margin: "10px 0 0",
                  }}
                >
                  Business Information System Student Symposium
                </p>
              </div>

              <div
                style={{
                  textAlign: "center",
                  margin: "40px 0",
                  lineHeight: 1.6,
                }}
              >
                <p style={{ fontSize: "18px", margin: "15px 0" }}>
                  This is to certify that
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "36px",
                    color: "#1a1a1a",
                    margin: "15px 0",
                  }}
                >
                  {authors[currentAuthorIndex]?.name || "Participant Name"}
                </p>
                <p style={{ fontSize: "18px", margin: "15px 0" }}>
                  has participated in the
                  <br />
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#1976d2",
                      margin: "15px 0",
                    }}
                  >
                    Business Information System Student Symposium (BISSS)
                  </span>
                  <br />
                  held on <strong>December 15, 2024</strong> as a{" "}
                  <strong>
                    {submissionData?.type === "Research Paper"
                      ? "Research Paper Author"
                      : "Project Author"}
                  </strong>
                </p>
                <p style={{ fontSize: "18px", margin: "15px 0" }}>
                  We appreciate their valuable contribution to the success of
                  this symposium.
                </p>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "50px",
                  left: "40px",
                  right: "40px",
                  display: "flex",
                  justifyContent: "space-between",
                  textAlign: "center",
                }}
              >
                <div style={{ flex: 1, position: "relative" }}>
                  <img
                    src="/assets/dean-signature.png"
                    alt="Dean's Signature"
                    style={{
                      width: "120px",
                      height: "auto",
                      position: "absolute",
                      bottom: "100px",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                  <div
                    style={{
                      width: "250px",
                      borderTop: "2px solid #1a1a1a",
                      margin: "10px auto",
                    }}
                  ></div>
                  <p
                    style={{
                      fontWeight: 600,
                      margin: "10px 0 5px",
                      fontSize: "16px",
                    }}
                  >
                    Prof. John Doe
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      lineHeight: 1.4,
                    }}
                  >
                    Dean
                    <br />
                    Faculty of Management Studies and Commerce
                  </p>
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <img
                    src="/assets/coordinator-signature.png"
                    alt="Coordinator's Signature"
                    style={{
                      width: "120px",
                      height: "auto",
                      position: "absolute",
                      bottom: "100px",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                  <div
                    style={{
                      width: "250px",
                      borderTop: "2px solid #1a1a1a",
                      margin: "10px auto",
                    }}
                  ></div>
                  <p
                    style={{
                      fontWeight: 600,
                      margin: "10px 0 5px",
                      fontSize: "16px",
                    }}
                  >
                    Dr. Jane Smith
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      lineHeight: 1.4,
                    }}
                  >
                    Event Coordinator
                    <br />
                    BISSS
                  </p>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "40px",
                  fontSize: "12px",
                  color: "#999",
                }}
              >
                Certificate ID: {submissionData?.id || "CERT-ID"}
              </div>
            </div>
          </div>
        </div>
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
          <Button
            onClick={handleGenerateAndSend}
            variant="contained"
            color="primary"
          >
            Generate & Send Certificates
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CertificatePreview;
