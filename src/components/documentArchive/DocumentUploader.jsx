import React, { useState } from "react";
import axiosInstance from "../../axios";
import { Button, Typography, Box, Stack, LinearProgress, Input } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useSnackbar } from '../../context/SnackbarContext';

const DocumentUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setUploading(true);

      try {
        const uploadResponse = await axiosInstance.post(
          "/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        showSnackbar(`File uploaded successfully. URL: ${uploadResponse.data.url}`, "success");
        await analyzeDocument(uploadResponse.data.url);
        onUploadSuccess(); // Refresh document list on successful upload and analysis
      } catch (error) {
        console.error("Error uploading file:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          showSnackbar(`Error uploading file: ${error.response.data.error || error.response.data.message}`, "error");
        } else {
          showSnackbar(`Error uploading file: ${error.message}`, "error");
        }
      } finally {
        setUploading(false);
      }
    }
  };

  const analyzeDocument = async (sasUrl) => {
    console.log(`Starting analysis for URL: ${sasUrl}`);
    try {
      const response = await axiosInstance.post("/api/analyze", { url: sasUrl });
      console.log(`Analysis complete: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Error during document analysis:', error.message);
      throw error;
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" mb={2}>
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
    </Box>
  );
}

export default DocumentUploader;
