import { Typography, Paper, TextField, Button, Divider } from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const UpdatePassword = () => {
  const { user, updatePassword } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await updatePassword(newPassword);
      setSuccess("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError("Failed to update password");
      console.error("Error updating password:", error);
    }
  };

  return (
    <Paper
      sx={{
        mt: 5,
        mr: 2,
        p: 10,
      }}
    >
      <Typography variant="h4" sx={{mb: 2} }>Update Password</Typography>
      <Divider sx={{mb: 2 }} />

      <Typography variant="body">
        Choose a strong password and refrain from using it on other accounts for
        added security.
      </Typography>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "white" }}>{success}</p>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          onChange={(e) => setNewPassword(e.target.value)}
          label="New Password"
          variant="outlined"
          type="password"
          value={newPassword}
          autoComplete="off"
          required
          name="new-password-field"
          sx={{ mt: 2 }}
        />
        <br />
        <TextField
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirm Password"
          variant="outlined"
          type="password"
          value={confirmPassword}
          autoComplete="off"
          required
          name="confirm-password-field"
          sx={{ mt: 1 }}
        />
        <br />
        <Button type="submit" variant="outlined" sx={{ mt: 1 }}>
          Update Password
        </Button>
      </form>
    </Paper>
  );
};

export default UpdatePassword;
