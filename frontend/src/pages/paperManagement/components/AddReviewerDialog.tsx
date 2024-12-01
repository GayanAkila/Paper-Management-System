import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Autocomplete,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Submission } from "../../../store/slices/submissionSlice";

interface AddReviewerDialogProps {
  open: boolean;
  onClose: () => void;
  reviewersList: string[];
  paper: Partial<Submission> | null;
  onSubmit: (reviewers: string[]) => void;
}

const AddReviewerDialog: React.FC<AddReviewerDialogProps> = ({
  open,
  onClose,
  reviewersList,
  paper,
  onSubmit,
}) => {
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);

  useEffect(() => {
    if (paper?.reviewers) {
      setSelectedReviewers(paper.reviewers);
    }
  }, [paper]);

  const handleSubmit = () => {
    onSubmit(selectedReviewers);
    setSelectedReviewers([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
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
          Assign Reviewers
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            multiple
            options={reviewersList}
            value={selectedReviewers}
            onChange={(_, newValue) => setSelectedReviewers(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Reviewers"
                placeholder="Search reviewers..."
              />
            )}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  {...getTagProps({ index })}
                  label={option}
                  sx={{
                    bgcolor: "#EDEDFF",
                    color: "#818CF8",
                    height: "24px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    "& .MuiChip-deleteIcon": {
                      color: "#818CF8",
                    },
                  }}
                />
              ))
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 1, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={selectedReviewers.length === 0}
            sx={{ borderRadius: 1, textTransform: "none" }}
          >
            Assign
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewerDialog;
