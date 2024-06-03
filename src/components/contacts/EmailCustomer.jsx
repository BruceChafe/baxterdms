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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EmailContact = ({ id, open, onClose, primaryEmail, lead, onSaveSuccess }) => {
  const [emailData, setEmailData] = useState({
    from: "brucechafe@gmail.com",
    to: primaryEmail,
    subject: "",
    body: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFieldChange = (key, value) => {
    setEmailData(prev => ({ ...prev, [key]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!isFormValid) return;

  //   setLoading(true);
  //   try {
  //     const payload = {
  //       from: {
  //         email: emailData.from
  //       },
  //       to: [{
  //         email: emailData.to
  //       }],
  //       subject: emailData.subject,
  //       html: emailData.body,
  //     };

  //     const response = await fetch("https://api.mailersend.com/v1/email", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer mlsn.32d70d2ba04e114e3dab71911d63594217b9b6be0c32864af190f16288756b77"
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to send email");
  //     }

  //     const responseData = await response.json();
  //     if (responseData.success) {
  //       setSnackbarMessage("Email sent successfully!");
  //       onSaveSuccess();
  //     } else {
  //       setSnackbarMessage("Email sending failed");
  //     }
  //   } catch (error) {
  //     setSnackbarMessage(`Error: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //     setSnackbarOpen(true);
  //   }
  // };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    onClose();
  };

  return (
    <p>hello</p>
    // <Dialog onClose={onClose} open={open}>
    //   <DialogTitle>
    //     Send Email
    //     <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
    //       <CloseIcon />
    //     </IconButton>
    //   </DialogTitle>
    //   <DialogContent dividers>
    //     <TextField label="To:" value={emailData.to} fullWidth disabled sx={{ pb: 1 }} />
    //     <TextField value={emailData.subject} onChange={e => handleFieldChange("subject", e.target.value)} label="Subject:" fullWidth sx={{ pb: 1 }} required />
    //     <TextField value={emailData.body} onChange={e => handleFieldChange("body", e.target.value)} label="Body:" multiline rows={4} fullWidth required />
    //   </DialogContent>
    //   <DialogActions>
    //     <Button variant="outlined" disabled>
    //       Coming Soon.
    //     </Button>
    //   </DialogActions>
    //   <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} message={snackbarMessage} action={
    //     <Button color="inherit" size="small" onClick={handleSnackbarClose}>
    //       Close
    //     </Button>
    //   }/>
    // </Dialog>
  );
};

export default EmailContact;
