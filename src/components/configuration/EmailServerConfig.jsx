import React, { useState, useEffect } from "react";
import { Paper, TextField, Typography, Button, IconButton, InputAdornment, Snackbar } from "@mui/material";
import { Box } from "@mui/system";
import { useFetchEmailConfig } from "../../hooks/FetchEmailConfig";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SaveEditButton from "../utilities/SaveEditButton";

const EmailServerConfig = () => {
  const { emailConfig, setEmailConfig } = useFetchEmailConfig();
  const [isEditable, setIsEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editableEmail, setEditableEmail] = useState('');
  const [editablePassword, setEditablePassword] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setEditableEmail(emailConfig?.emailUser || '');
    setEditablePassword(emailConfig?.emailPass || '');
  }, [emailConfig]);

  const handleEditClick = () => {
    if (isEditable) {
      handleSave();
    }
    setIsEditable(!isEditable);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSave = async () => {
    try {
      const updatedConfig = {
        emailUser: editableEmail,
        emailPass: editablePassword,
      };
      const response = await fetch(`http://localhost:8000/emailconfig`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedConfig),
      });

      if (response.ok) {
        setSnackbarMessage("Save successful");
        setEmailConfig(updatedConfig);
        setShowPassword(false); 
        setIsEditable(false);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setSnackbarOpen(true);
    }
  };


  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" mb={2}>Email Server Configuration</Typography>
        <TextField
          label="Email"
          value={editableEmail}
          onChange={(e) => setEditableEmail(e.target.value)}
          disabled={!isEditable}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={editablePassword}
          onChange={(e) => setEditablePassword(e.target.value)}
          disabled={!isEditable}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  disabled={!isEditable}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <SaveEditButton isEditable={isEditable} onToggleEdit={handleEditClick} />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Paper>
    </Box>
  );
};

export default EmailServerConfig;
