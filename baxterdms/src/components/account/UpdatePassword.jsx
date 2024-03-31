import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const UpdatePassword = () => {
  const { updateUserPassword } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    try {
      await updateUserPassword(newPassword);
      setFeedback({
        type: "success",
        message: "Password updated successfully!",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      let message = "Failed to update password.";
      if (error.code === "auth/weak-password") {
        message = "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/requires-recent-login") {
        message = "Please re-authenticate to update your password.";
      }
      setFeedback({ type: "error", message });
      console.error("Error updating password:", error);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" mb={2}>
          Update Password
        </Typography>
        <Typography variant="body1" mb={2}>
          Choose a strong password and refrain from using it on other accounts
          for added security.
        </Typography>
        {feedback.message && (
          <Alert severity={feedback.type} sx={{ mb: 2 }}>
            {feedback.message}
          </Alert>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="outlined" color="primary">
            Update Password
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default UpdatePassword;
