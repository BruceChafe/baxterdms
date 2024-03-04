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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EmailContact = ({ id, open, onClose, primaryEmail }) => {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const apiUrl = "http://localhost:3001/send-email";

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "bchafe@capitalautogroup.ca",
          from,
          subject,
          body,
        }),
      });

      const data = await response.json();
      const timestamp = new Date().toISOString();

      if (data.success) {
        setSnackbarMessage("Email sent successfully!");
      } else {
        setSnackbarMessage(`Error: ${data.error}`);
      }

      const leadResponse = await fetch(`http://localhost:8000/leads/${id}`);
      const leadData = await leadResponse.json();

      const updatedHistory = [
        ...leadData.history,
        [timestamp, data.success ? response : data.error],
      ];

      await fetch(`http://localhost:8000/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: updatedHistory,
        }),
      });

      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
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
          onChange={(e) => setFrom(e.target.value)}
          id="from"
          label="From:"
          fullWidth
          value={"baxterdms@outlook.com"}
          sx={{ pb: 1 }}
        />
        <TextField
          onChange={(e) => setSubject(e.target.value)}
          id="subject"
          label="Subject:"
          fullWidth
          sx={{ pb: 1 }}
        />
        <TextField
          onChange={(e) => setBody(e.target.value)}
          id="body"
          label="Body:"
          multiline
          rows={4}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Send
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
