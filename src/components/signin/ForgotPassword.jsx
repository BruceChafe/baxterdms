import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

const ForgotPassword = ({ toggleView }) => {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`If there is an account associated with ${email}, you will receive an email with instructions to reset your password.`);
      setOpen(true);
    } catch (error) {
      setError(error.message);
      setMessage("");
    }
  };

  return (
    <Box component="form" noValidate sx={{ mt: 1, width: "80%" }} onSubmit={handleResetPassword}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Reset Password
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <Button startIcon={<ArrowBackIcon />} onClick={() => toggleView(false)} sx={{ mt: 1, mb: 2 }}>
        Back to Sign In
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", border: "2px solid #000", p: 4 }}>
          <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", top: 10, right: 10 }}>
            <CloseIcon />
          </IconButton>
          <Typography id="password-reset-modal-description" sx={{ mt: 2 }}>
            {message}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default ForgotPassword;
