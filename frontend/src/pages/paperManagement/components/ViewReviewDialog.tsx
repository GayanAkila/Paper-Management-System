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
  ListItem,
  Avatar,
  List,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { Submission } from "../../../store/slices/submissionSlice";
import { formatDate } from "../../../utils/utils";

interface ViewReviewDialogProps {
  open: boolean;
  onClose: () => void;
  paper: Partial<Submission>;
}

const ViewReviewDialog = ({ open, onClose, paper }: ViewReviewDialogProps) => {
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
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Paper Title
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              {paper.title}
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
            {getDecisionChip(paper.reviews?.finalDecision || "submitted")}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 1,
              p: 1,
              bgcolor: "white",
            }}
          >
            <List sx={{ mb: 2 }}>
              {paper.reviews?.comments.map((comment, index) => (
                <ListItem
                  key={index}
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    bgcolor: (theme) => theme.palette.background.default,
                    borderRadius: 1,
                    mb: 2,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: "0.75rem",
                          bgcolor: "primary.main",
                        }}
                      >
                        {comment.reviewer.charAt(0)}
                      </Avatar>
                      {comment.reviewer}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.submittedAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {comment.comments}
                  </Typography>
                  {/* {comment.fileUrl && (
                    <Button
                      startIcon={<DocumentIcon />}
                      variant="outlined"
                      size="small"
                      onClick={() => window.open(comment.fileUrl!, "_blank")}
                      sx={{ textTransform: "none" }}
                    >
                      View Review Document
                    </Button>
                  )} */}
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}></DialogActions>
    </Dialog>
  );
};

export default ViewReviewDialog;
