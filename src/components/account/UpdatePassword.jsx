import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const UpdatePassword = () => {
  const { updateUserPassword, reauthenticate } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    if (newPassword !== confirmPassword) {
      setLoading(false);
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    try {
      await reauthenticate(currentPassword);
      await updateUserPassword(newPassword);
      setFeedback({
        type: "success",
        message: "Password updated successfully!",
      });
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error) {
      handlePasswordUpdateError(error);
    } finally {
      setLoading(false);  // Stop loading regardless of the outcome
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
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
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            fullWidth
            required
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            fullWidth
            required
            sx={{ mb: 2 }}
            disabled={loading}
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
            disabled={loading}
          />
          <Button type="submit" variant="outlined" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Update Password"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default UpdatePassword;
