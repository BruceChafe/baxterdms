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
  TextField,
  Stack,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Info as InfoIcon,
  ExpandLess,
  ExpandMore,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from '../../context/SnackbarContext';
import CameraCaptureDialog from "./utilities/CameraCaptureDialog";

const LicenseUploader = ({ onUploadSuccess, open, onToggle, setCapturedImage, setUploadedImage }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [capturedImage, setCapturedImageState] = useState(null); // Local state for captured image
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
    if (!documentType) {
      showSnackbar(`Document type is required.`, "error");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else if (capturedImage) {
      const blob = await fetch(capturedImage).then(res => res.blob());
      formData.append("file", new File([blob], "captured_image.jpg"));
    }
    formData.append("documentType", documentType);
    formData.append("metadata", JSON.stringify({})); // Add any additional metadata here

    setUploading(true);

    try {
      const uploadResponse = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSnackbar(`Driver's license successfully uploaded.`, "success");

      const analyzerType = "document"; // Adjust if you need different types
      await analyzeDocument(uploadResponse.data.url, analyzerType);

      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      showSnackbar(`Error uploading file: ${error.message}`, "error");
    } finally {
      setUploading(false);
    }
  }, [file, capturedImage, documentType, showSnackbar, onUploadSuccess]);

  const analyzeDocument = useCallback(async (sasUrl, analyzerType) => {
    console.log(`Starting analysis for URL: ${sasUrl} as ${analyzerType}`);
    try {
      const response = await axiosInstance.post("/analyze", { url: sasUrl, analyzerType });
      showSnackbar(`Driver's license successfully analyzed.`, "success");
      console.log(`Analysis complete: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Error during document analysis:', error.message);
      throw error;
    }
  }, [showSnackbar]);

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
          <TextField
            label="Document Type"
            variant="outlined"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            fullWidth
          />
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
