import React, { useState, useCallback } from "react";
import axiosInstance from "../../axios";
import {
  Button,
  Typography,
  Box,
  Grid,
  LinearProgress,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
  Collapse,
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Info as InfoIcon,
  ExpandLess,
  ExpandMore
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from '../../context/SnackbarContext';

const DocumentUploader = ({ onUploadSuccess, open, onToggle }) => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [metadata, setMetadata] = useState('');
  const [uploading, setUploading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFilename(selectedFile.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*,.pdf' });

  const handleUpload = useCallback(async () => {
    if (!file || !documentType || !filename) return;

    const formData = new FormData();
    formData.append("file", new File([file], filename));
    formData.append("documentType", documentType);
    formData.append("metadata", metadata);
    setUploading(true);

    try {
      const uploadResponse = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSnackbar(`File successfully uploaded to storage.`, "success");

      const analyzerType = documentType;
      await analyzeDocument(uploadResponse.data.url, analyzerType);

      onUploadSuccess(); // Refresh document list on successful upload and analysis
    } catch (error) {
      console.error("Error uploading file:", error);
      showSnackbar(`Error uploading file: ${error.message}`, "error");
    } finally {
      setUploading(false);
    }
  }, [file, filename, documentType, metadata, onUploadSuccess, showSnackbar]);

  const analyzeDocument = useCallback(async (sasUrl, analyzerType) => {
    console.log(`Starting analysis for URL: ${sasUrl} as ${analyzerType}`);
    try {
      const response = await axiosInstance.post("/analyze", { url: sasUrl, analyzerType });
      showSnackbar(`File successfully analyzed.`, "success");
      console.log(`Analysis complete: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Error during document analysis:', error.message);
      throw error;
    }
  }, []);

  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={onToggle}
      >
        <Typography variant="h5">
          Upload your document
        </Typography>
        {open ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Collapse in={open}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Document Type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              fullWidth
            >
              <MenuItem value="invoice">Invoice</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
              <MenuItem value="receipt">Receipt</MenuItem>
              <MenuItem value="layout">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Metadata"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <Tooltip title="Metadata includes additional information about the document, such as keywords, tags, or descriptions.">
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
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
                <Typography>File "{filename}" is ready to be uploaded.</Typography>
              ) : (
                <Typography>Drag 'n' drop some files here, or click to select files</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!file || !documentType || !filename || uploading}
              startIcon={<CloudUploadIcon />}
              fullWidth={isSmallScreen}
            >
              Upload Document
            </Button>
          </Grid>
          {uploading && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </Collapse>
    </>
  );
};

export default DocumentUploader;
