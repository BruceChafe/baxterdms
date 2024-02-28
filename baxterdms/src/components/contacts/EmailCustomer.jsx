// Import necessary components and icons from Material-UI
import {
  Paper,
  IconButton,
  Box,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

// Functional component for the EmailContact panel
const EmailContact = ({ lead, showPanel, onClose, primaryEmail }) => {
  // State variables to manage form inputs and panel visibility
  // const [contactEmail, setContactEmail] = useState(lead.emailAddress1);
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const apiUrl = "http://localhost:3001/send-email";

  // Function to handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // State variable to manage the visibility of the panel
  const [panelVisible, setPanelVisible] = useState(showPanel);

  // Function to close the panel
  const handleClosePanel = () => {
    setPanelVisible(false);
    onClose();
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send email data to the server using fetch
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

      // Parse the response data
      const data = await response.json();

      // Update Snackbar message based on the server response
      if (data.success) {
        setSnackbarMessage("Email sent successfully!");
      } else {
        setSnackbarMessage(`Error: ${data.error}`);
      }

      // Open Snackbar and close the panel
      setSnackbarOpen(true);
      setPanelVisible(false);
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  // JSX for rendering the EmailContact panel
  return (
    <>
      {/* Render the panel only if the showPanel prop is true */}
      {showPanel && (
        <Paper
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            width: "75%",
            height: "95vh",
            zIndex: 9999,
          }}
        >
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "90%" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            {/* Close button */}
            <IconButton
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 9999,
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
            <TextField id="to" label="To:" defaultValue={primaryEmail} />
            <br />
            <TextField
              onChange={(e) => setFrom(e.target.value)}
              id="from"
              label="from:"
              value={"baxterdms@outlook.com"}
            />
            <br />
            <TextField
              onChange={(e) => setSubject(e.target.value)}
              id="subject"
              label="subject:"
            />
            <br />
            <TextField
              onChange={(e) => setBody(e.target.value)}
              id="body"
              label="body:"
              multiline
              rows={12}
            />
            <br />

            {/* Submit button */}
            <Button type="submit" color="secondary" variant="outlined">
              Submit
            </Button>
          </Box>

          {/* Snackbar for displaying success/error messages */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => {
              handleSnackbarClose();
              handleClosePanel();
            }}
            message={snackbarMessage}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          />
        </Paper>
      )}
    </>
  );
};

// Export the EmailContact component
export default EmailContact;
