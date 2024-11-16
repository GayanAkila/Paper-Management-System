import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

interface ViewReviewDialogProps {
  open: boolean;
  onClose: () => void;
  reviewData: {
    title: string;
    comment: string;
    decision: string;
    attachmentUrl?: string;
    attachmentName?: string;
    reviewer: string;
    reviewDate: string;
  };
}

const ViewReviewDialog = ({
  open,
  onClose,
  reviewData,
}: ViewReviewDialogProps) => {
  const getDecisionChip = (decision: string) => {
    const styles = {
      Approved: {
        bgcolor: "#DEF7EC",
        color: "#059669",
      },
      Rejected: {
        bgcolor: "#FEE2E2",
        color: "#DC2626",
      },
      "Approved with changes": {
        bgcolor: "#FEF3C7",
        color: "#D97706",
      },
    };

    const style = styles[decision as keyof typeof styles] || styles["Approved"];

    return (
      <Chip
        label={decision}
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E2E8F0",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Review Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Paper Title
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              {reviewData.title}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Reviewer
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              {reviewData.reviewer}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Decision
            </Typography>
            {getDecisionChip(reviewData.decision)}
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Review Comments
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                p: 2,
                bgcolor: "#F8FAFC",
                borderRadius: 1,
                whiteSpace: "pre-wrap",
              }}
            >
              {reviewData.comment}
            </Typography>
          </Box>

          {reviewData.attachmentUrl && (
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Attachment
              </Typography>
              <Button
                startIcon={<DownloadIcon />}
                variant="outlined"
                onClick={() => window.open(reviewData.attachmentUrl, "_blank")}
                sx={{
                  textTransform: "none",
                  borderRadius: 1.5,
                }}
              >
                {reviewData.attachmentName || "Download Attachment"}
              </Button>
            </Box>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
            Reviewed on {reviewData.reviewDate}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ borderRadius: 1.5 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewReviewDialog;

// Usage Example:
/*
  const YourComponent = () => {
    const [open, setOpen] = useState(false);
    
    const sampleReviewData = {
      title: "The Impact of AI on Business...",
      comment: "The paper demonstrates a thorough understanding of the subject matter. However, there are a few areas that need attention:\n\n1. The literature review section could be more comprehensive\n2. Some recent developments in the field should be included\n3. The methodology section is well-structured",
      decision: "Approved with changes",
      attachmentUrl: "/path/to/attachment.pdf",
      attachmentName: "Detailed_Review.pdf",
      reviewer: "Dr. Harsha Kumar",
      reviewDate: "15 March 2024"
    };
  
    return (
      <>
        <Button onClick={() => setOpen(true)}>View Review</Button>
        
        <ViewReviewDialog
          open={open}
          onClose={() => setOpen(false)}
          reviewData={sampleReviewData}
        />
      </>
    );
  };
  */
