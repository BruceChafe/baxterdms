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
import { useFetchEmailConfig } from "../../../hooks/FetchEmailConfig";

const EmailContact = ({
  id,
  open,
  onClose,
  primaryEmail,
  lead,
  onSaveSuccess,
}) => {
  console.log(primaryEmail)
  const { emailConfig, loading: configLoading, error: configError } = useFetchEmailConfig();
  console.log(emailConfig)
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
    if (!isFormValid || configLoading) return; // Ensure form is valid and config is not loading
  
    setLoading(true); // Indicate the start of an async operation
    try {
      // Construct the request payload to include both email data and configuration
      const emailRequestData = {
        ...emailData, // Existing email data: from, to, subject, body
        config: emailConfig, // Include the fetched email configuration
      };
  
      // Make a POST request to your server endpoint with the email data and configuration
      const sendEmailResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailRequestData),
      });
  
      // Check if the server responded with an error
      if (!sendEmailResponse.ok) {
        throw new Error("Failed to send email");
      }
  
      const sendEmailData = await sendEmailResponse.json(); // Assuming the server responds with JSON
      const timestamp = new Date().toISOString(); // Capture the current timestamp for logging or UI purposes
      const leadNumber = lead.leadNumber; // Use the lead number, if applicable to your application logic
      const activityType = "Email Sent"; // Define the activity type for logging or further processing
  
      // If the email was sent successfully, you might want to log this event
      if (sendEmailData.success) {
        const logEmailData = { ...emailRequestData, leadNumber, timestamp, activityType };
        const logEmailResponse = await fetch("http://localhost:8000/emails", { // Adjust URL as necessary
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logEmailData),
        });
  
        if (!logEmailResponse.ok) {
          throw new Error("Failed to log email activity");
        }
  
        // Update the UI to reflect the successful operation
        setSnackbarMessage("Email sent and logged successfully!");
        onSaveSuccess(); // Callback function to notify parent component or perform further actions
      } else {
        // Handle cases where email sending fails but the server responds
        setSnackbarMessage(`Error: ${sendEmailData.message || "Email sending failed"}`);
      }
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      // Reset loading state and show the snackbar with the result message
      setLoading(false);
      setSnackbarOpen(true);
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
