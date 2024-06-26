import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Button
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSnackbar } from "../../context/SnackbarContext";

const EmailServerConfig = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editableEmail, setEditableEmail] = useState("");
  const [editablePassword, setEditablePassword] = useState("");
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "emailServerConfig", "configData");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const configData = docSnap.data();
          setEditableEmail(configData.emailUser || "");
          setEditablePassword(configData.emailPass || "");
        } else {
          showSnackbar("No email configuration found.", "info");
        }
      } catch (error) {
        showSnackbar(`Fetch error: ${error.message}`, "error");
      }
    };

    fetchData();
  }, [showSnackbar]);

  const handleSave = async () => {
    setLoading(true);
    const docRef = doc(db, "emailServerConfig", "configData");

    try {
      await updateDoc(docRef, {
        emailUser: editableEmail,
        emailPass: editablePassword,
      });
      showSnackbar("Configuration saved successfully!", "success");
      setIsEditable(false);
    } catch (error) {
      showSnackbar("Failed to save configuration: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (isEditable) {
      handleSave();
    } else {
      setIsEditable(true);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
        <Typography variant="h5" mb={2}>
          Email Server Configuration
        </Typography>
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
        <Button
          onClick={handleEditClick}
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {isEditable ? "Save" : "Edit"}
        </Button>
      </Paper>
    </Box>
  );
};

export default EmailServerConfig;
