import React, { useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EmailContact = ({ id, open, onClose, primaryEmail, lead, onSaveSuccess }) => {
  const [emailData, setEmailData] = useState({
    from: "baxterdms@outlook.com",
    subject: "",
    body: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = "http://localhost:3001/send-email";

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFieldChange = (key, value) => {
    setEmailData({
      ...emailData,
      [key]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: primaryEmail,
          from: emailData.from,
          subject: emailData.subject,
          body: emailData.body,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setSnackbarMessage("Email sent successfully!");
  
        const timestamp = new Date().toISOString();
        const updatedLead = {
          ...lead,
          emails: [
            ...(lead.emails || []),
            {
              from: emailData.from,
              to: primaryEmail,
              subject: emailData.subject,
              body: emailData.body,
              timestamp: timestamp,
              activity: "Email Sent"
            },
          ],
        };
  
        await fetch(`http://localhost:8000/leads/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedLead),
        });
      } else {
        setSnackbarMessage(`Error: ${data.error}`);
      }
  
      setSnackbarOpen(true);
      setTimeout(() => {
        onClose();
      }, 2000);
      onSaveSuccess();
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Send Email
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          id="to"
          label="To:"
          defaultValue={primaryEmail}
          fullWidth
          disabled
          sx={{ pb: 1 }}
        />
        <TextField
          onChange={(e) => handleFieldChange("subject", e.target.value)}
          id="subject"
          label="Subject:"
          fullWidth
          sx={{ pb: 1 }}
        />
        <TextField
          onChange={(e) => handleFieldChange("body", e.target.value)}
          id="body"
          label="Body:"
          multiline
          rows={4}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Send"}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default EmailContact;
