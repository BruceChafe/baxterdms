import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../../context/SnackbarContext";

const UpdatePassword = () => {
  const { updateUserPassword, reauthenticate } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setLoading(false);
      showSnackbar("Passwords do not match.", "error");
      return;
    }

    try {
      await reauthenticate(currentPassword);
      await updateUserPassword(newPassword);
      showSnackbar("Password updated successfully!", "success");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error) {
      showSnackbar("Failed to update password. Please try again.", "error");
    } finally {
      setLoading(false);
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
        <form onSubmit={handleSubmit} noValidate>
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
