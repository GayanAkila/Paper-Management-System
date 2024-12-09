import { Close, Description } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
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
    <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h6" fontWeight={500}>
        View Certificates
      </Typography>
      <IconButton onClick={onClose} size="small">
        <Close />
      </IconButton>
    </DialogTitle>
    <Divider />
    <DialogContent>
      <Stack spacing={2} sx={{ my: 2 }}>
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
  </Dialog>
);

export default ViewCertificatesDialog;
