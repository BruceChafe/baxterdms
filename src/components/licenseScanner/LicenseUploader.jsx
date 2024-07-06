import React, { useState, useCallback } from "react";
import axiosInstance from "../../axios";
import {
  Button,
  Typography,
  Box,
  LinearProgress,
  Collapse,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "../../context/SnackbarContext";
import CameraCaptureDialog from "./utilities/CameraCaptureDialog";

import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";

const key = import.meta.env.VITE_AZURE_FORM_RECOGNIZER_KEY;
const endpoint = import.meta.env.VITE_AZURE_FORM_RECOGNIZER_ENDPOINT;

const LicenseUploader = ({ onUploadSuccess, open, onToggle, setCapturedImage, setUploadedImage }) => {
  const [file, setFile] = useState(null);
  const [capturedImage, setCapturedImageState] = useState(null); 
  const [uploading, setUploading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

   const handleCapture = (imageSrc) => {
    setCapturedImageState(imageSrc);
    setCapturedImage(imageSrc);
    setFile(null);
    setUploadedImage(null);
    setCameraOpen(false);
  };

  const handleUpload = useCallback(async () => {
    if (!file && !capturedImage) return;

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else if (capturedImage) {
      const blob = await fetch(capturedImage).then(res => res.blob());
      formData.append("file", new File([blob], "captured_image.jpg"));
    }

    formData.append("documentType", "driverLicense");  // Example document type, update as necessary

    setUploading(true);

    try {
      const uploadResponse = await axiosInstance.post("/uploadLicense", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSnackbar("Driver's license successfully uploaded.", "success");

      const documentData = uploadResponse.data.extractedData; // Get the extracted data from the server response

      onUploadSuccess(documentData);
    } catch (error) {
      console.error("Error uploading file:", error);
      showSnackbar(`Error uploading file: ${error.message}`, "error");
    } finally {
      setUploading(false);
    }
  }, [file, capturedImage, showSnackbar, onUploadSuccess]);

  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={onToggle}
      >
        <Typography variant="h5">
          Upload Driver's License
        </Typography>
      </Box>
      <Collapse in={open}>
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<PhotoCameraIcon />}
            onClick={() => setCameraOpen(true)}
            disabled={uploading}
          >
            Capture with Camera
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={(!file && !capturedImage) || uploading}
            startIcon={<CloudUploadIcon />}
            fullWidth={isSmallScreen}
          >
            Upload Driver's License
          </Button>
          {uploading && <LinearProgress />}
        </Stack>

        <CameraCaptureDialog
          cameraOpen={cameraOpen}
          onClose={() => setCameraOpen(false)}
          onCapture={handleCapture}
        />
      </Collapse>
    </>
  );
};

export default LicenseUploader;
