import React, { useState, useEffect } from "react";
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

const EmailContact = ({
  id,
  open,
  onClose,
  primaryEmail,
  lead,
  onSaveSuccess,
}) => {
  const [emailData, setEmailData] = useState({
    from: "baxterdms@outlook.com",
    to: primaryEmail,
    subject: "",
    body: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = "http://localhost:3001/send-email";

  useEffect(() => {
    const isValid = Object.values(emailData).every((value) => {
      return typeof value === "string" ? value.trim() !== "" : value !== null;
    });
    setIsFormValid(isValid);
  }, [emailData]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    onClose();
  };

  const handleFieldChange = (key, value) => {
    setEmailData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const sendEmailResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!sendEmailResponse.ok) {
        throw new Error("Failed to send email");
      }

      const sendEmailData = await sendEmailResponse.json();
      const timestamp = new Date().toISOString();
      const leadNumber = lead.leadNumber;
      const activityType = "Email Sent"

      if (sendEmailData.success) {
        const logEmailData = { ...emailData, leadNumber, timestamp, activityType };
        const logEmailResponse = await fetch("http://localhost:8000/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logEmailData),
        });

        if (!logEmailResponse.ok) {
          throw new Error("Failed to log email");
        }

        setSnackbarMessage("Email sent and logged successfully!");
        onSaveSuccess();
      } else {
        setSnackbarMessage(
          `Error: ${sendEmailData.message || "Email sending failed"}`
        );
      }
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle id="customized-dialog-title">
        Send Email
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
          onChange={(e) => handleFieldChange("subject", e.target.value)}
          label="Subject:"
          fullWidth
          sx={{ pb: 1 }}
          required
        />
        <TextField
          value={emailData.body}
          onChange={(e) => handleFieldChange("body", e.target.value)}
          label="Body:"
          multiline
          rows={4}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!isFormValid || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Send"}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </Dialog>
  );
};

export default EmailContact;
