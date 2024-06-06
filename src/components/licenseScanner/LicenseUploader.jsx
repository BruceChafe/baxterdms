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
  ExpandLess,
  ExpandMore,
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

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setCapturedImageState(null);
      setUploadedImage(URL.createObjectURL(selectedFile));
    }
  }, [setUploadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*,.pdf' });

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

    // Add the document type to the form data
    formData.append("documentType", "driverLicense");  // Example document type, update as necessary

    setUploading(true);

    try {
      const uploadResponse = await axiosInstance.post("/uploadLicense", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSnackbar(`Driver's license successfully uploaded.`, "success");

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
        {open ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Collapse in={open}>
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.500',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? 'grey.100' : 'inherit'
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography>Drop the files here ...</Typography>
            ) : file ? (
              <Typography>File is ready to be uploaded.</Typography>
            ) : (
              <Typography>Drag 'n' drop a driver's license here, or click to select a file</Typography>
            )}
          </Box>
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
