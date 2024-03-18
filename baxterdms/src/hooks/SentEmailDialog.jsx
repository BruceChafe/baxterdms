import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  IconButton,
  Typography,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UseSentEmailDialog = ({ open, onClose, emailData }) => {
  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle id="customized-dialog-title">
        Sent Email Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="To:"
          value={emailData.to}
          fullWidth
          disabled
          sx={{ pb: 1 }}
        />
        <TextField
          value={emailData.subject}
          label="Subject:"
          fullWidth
          sx={{ pb: 1 }}
          disabled
        />
        <TextField
          value={emailData.body}
          label="Body:"
          multiline
          rows={4}
          fullWidth
          disabled
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UseSentEmailDialog;
