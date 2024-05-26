import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Box,
  Stack,
  Snackbar,
  Alert,
  LinearProgress,
  Input,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const DocumentUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setUploading(true);

      try {
        const uploadResponse = await axios.post(
          "http://localhost:3001/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSnackbarMessage(`File uploaded successfully. URL: ${uploadResponse.data.url}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        await analyzeDocument(uploadResponse.data.url);
        onUploadSuccess(); // Refresh document list on successful upload and analysis
      } catch (error) {
        console.error("Error uploading file:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          setSnackbarMessage(`Error uploading file: ${error.response.data.error || error.response.data.message}`);
        } else {
          setSnackbarMessage(`Error uploading file: ${error.message}`);
        }
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setUploading(false);
      }
    }
  };

  const analyzeDocument = async (sasUrl) => {
    try {
      const response = await axios.post("http://localhost:3001/analyze", { url: sasUrl });
      console.log("Analysis success:", response.data);
      setSnackbarMessage("Document analysis completed successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Analysis failed:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        setSnackbarMessage(`Error analyzing document: ${error.response.data.error || error.response.data.message}`);
      } else {
        setSnackbarMessage(`Error analyzing document: ${error.message}`);
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upload your document
      </Typography>
      <Stack direction="column" spacing={2} alignItems="center">
        <label htmlFor="raised-button-file">
          <Input
            accept="image/*,.pdf"
            sx={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            disabled={uploading}
          >
            Choose File
          </Button>
        </label>
        <Button
          variant="outlined"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          Upload Document
        </Button>
        {uploading && <LinearProgress sx={{ width: "100%", mt: 2 }} />}
      </Stack>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DocumentUploader;
