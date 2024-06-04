import React, { useState, useCallback } from "react";
import axiosInstance from "../../axios";
import {
  Button,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Tooltip,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

const DocumentUploader = ({ onUploadSuccess, open, onToggle, setCapturedImage, setUploadedImage }) => {
  const [file, setFile] = useState(null);
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
      setUploadedImage(URL.createObjectURL(selectedFile)); // Set the uploaded image preview
    }
  }, [setUploadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*,.pdf' });

  const handleCapture = (imageSrc) => {
    setCapturedImageState(imageSrc);
    setFile(null);
    setUploadedImage(null);
    setCameraOpen(false);
  };

  const handleUpload = useCallback(async () => {
    const fileToUpload = file || capturedImage;
    if (!fileToUpload) return;

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("file", dataURItoBlob(capturedImage));
    }
    formData.append("documentType", "driverLicense");
    setUploading(true);

    try {
      const uploadResponse = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSnackbar(`Driver's license successfully uploaded.`, "success");

      const analyzerType = "driverLicense";
      await analyzeDocument(uploadResponse.data.url, analyzerType);

      onUploadSuccess(); // Refresh document list on successful upload and analysis
    } catch (error) {
      console.error("Error uploading file:", error);
      showSnackbar(`Error uploading file: ${error.message}`, "error");
    } finally {
      setUploading(false);
    }
  }, [file, capturedImage, onUploadSuccess, showSnackbar]);

  const analyzeDocument = useCallback(async (sasUrl, analyzerType) => {
    console.log(`Starting analysis for URL: ${sasUrl} as ${analyzerType}`);
    try {
      const response = await axiosInstance.post("/api/analyze", { url: sasUrl, analyzerType });
      showSnackbar(`Driver's license successfully analyzed.`, "success");
      console.log(`Analysis complete: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Error during document analysis:', error.message);
      throw error;
    }
  }, [showSnackbar]);

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
            disabled={!file && !capturedImage || uploading}
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

export default DocumentUploader;
