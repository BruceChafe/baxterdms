import React, { useState, useCallback } from "react";
import { Button, Typography, Box, Stack, LinearProgress, Input, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { CloudUpload as CloudUploadIcon, PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";
import axiosInstance from "../../axios";
import CameraCapture from "./utilities/CameraCapture";
import { useSnackbar } from '../../context/SnackbarContext';

const LicenseUploader = ({ onUploadSuccess, setCapturedImage, setUploadedImage }) => {
  const [file, setFile] = useState(null);
  const [capturedImage, setCapturedImageState] = useState(null); // Local state for captured image
  const [uploading, setUploading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setCapturedImageState(null);
    setUploadedImage(URL.createObjectURL(selectedFile)); // Set the uploaded image preview
  };

  const handleCapture = (imageSrc) => {
    setCapturedImageState(imageSrc);
    setUploadedImage(null);
    setCameraOpen(false);
  };

  const handleUpload = useCallback(async () => {
    const fileToUpload = file || capturedImage;
    if (fileToUpload) {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else {
        formData.append("file", dataURItoBlob(capturedImage));
      }
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
        await analyzeLicense(uploadResponse.data.url);
        onUploadSuccess(); // Refresh license list on successful upload and analysis
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
  }, [file, capturedImage, onUploadSuccess, showSnackbar]);

  const analyzeLicense = useCallback(async (sasUrl) => {
    console.log(`Starting analysis for URL: ${sasUrl}`);
    try {
      const response = await axiosInstance.post("/api/analyze", { url: sasUrl, documentType: 'idDocument' });
      console.log(`Analysis complete: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Error during license analysis:', error.message);
      throw error;
    }
  }, []);

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" mb={2}>
        Upload your license
      </Typography>
      <Stack direction="column" spacing={2} alignItems="center">
        <Button
          variant="contained"
          startIcon={<PhotoCameraIcon />}
          onClick={() => setCameraOpen(true)}
          disabled={uploading}
        >
          Capture with Camera
        </Button>
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
          disabled={!(file || capturedImage) || uploading}
        >
          Upload License
        </Button>
        {uploading && <LinearProgress sx={{ width: "100%", mt: 2 }} />}
      </Stack>

      <Dialog open={cameraOpen} onClose={() => setCameraOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Capture Image</DialogTitle>
        <DialogContent>
          <CameraCapture onCapture={handleCapture} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCameraOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LicenseUploader;
