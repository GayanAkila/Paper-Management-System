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
  TextField,
} from "@mui/material";
import {
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { Submission } from "../../../store/slices/submissionSlice";
import { formatDate } from "../../../utils/utils";
import StatusChip from "../../../components/StatusChip";
import { Description as DocumentIcon } from "@mui/icons-material";

interface ViewReviewDialogProps {
  open: boolean;
  onClose: () => void;
  paper: Partial<Submission>;
}

const ViewReviewDialog = ({ open, onClose, paper }: ViewReviewDialogProps) => {
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
        <Box
          gap={1}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Feedbacks
          </Typography>
          <StatusChip status={paper.reviews?.finalDecision || "submitted"} />
        </Box>

        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Box sx={{ pr: 2, pl: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Paper Title
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              {paper.title}
            </Typography>
          </Box>

          <Box>
            <List sx={{ mb: 1 }}>
              {paper.reviews?.comments.map((comment, index) => (
                <ListItem
                  key={index}
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    borderRadius: 1,
                    mb: 1,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      justifyContent: "space-between",
                      width: "100%",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignContent: "center",
                        gap: 2,
                        p: 1,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: (theme) =>
                          theme.palette.background.lightBackground,
                      }}
                    >
                      <Typography>{comment.reviewer}</Typography>
                      <Typography variant="body2">
                        {formatDate(comment.submittedAt)}
                      </Typography>
                    </Box>
                    <TextField
                      multiline
                      label="Comment"
                      value={comment.comments}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  {comment.fileUrl && (
                    <Button
                      startIcon={<DocumentIcon />}
                      variant="outlined"
                      size="small"
                      onClick={() => window.open(comment.fileUrl!, "_blank")}
                      sx={{ textTransform: "none" }}
                    >
                      View Review Document
                    </Button>
                  )}
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
