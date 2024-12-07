import { Description } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

interface ViewCertificatesDialogProps {
  open: boolean;
  onClose: () => void;
  certificates: {
    name: string;
    certificateUrl: string;
  }[];
}

const ViewCertificatesDialog: React.FC<ViewCertificatesDialogProps> = ({
  open,
  onClose,
  certificates,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Typography variant="h6" fontWeight={600}>
        View Certificates
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {certificates.map((cert, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => window.open(cert.certificateUrl, "_blank")}
            startIcon={<Description />}
            sx={{ textTransform: "none" }}
          >
            {cert.name}'s Certificate
          </Button>
        ))}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} sx={{ textTransform: "none" }}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default ViewCertificatesDialog;
