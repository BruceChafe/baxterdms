import React, { useState, useCallback } from "react";
import axiosInstance from "../../axios";
import { Button, Typography, Box, Stack, LinearProgress, TextField, MenuItem, Tooltip, IconButton } from "@mui/material";
import { CloudUpload as CloudUploadIcon, Info as InfoIcon } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from '../../context/SnackbarContext';

const DocumentUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [metadata, setMetadata] = useState('');
  const [uploading, setUploading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFilename(selectedFile.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*,.pdf' });

  const handleUpload = useCallback(async () => {
    if (file && documentType && filename) {
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

        showSnackbar(`File uploaded successfully. URL: ${uploadResponse.data.url}`, "success");

        // Set analyzer type based on document type
        const analyzerType = documentType === 'other' ? 'document' : documentType;
        await analyzeDocument(uploadResponse.data.url, analyzerType);

        onUploadSuccess(); // Refresh document list on successful upload and analysis
      } catch (error) {
        console.error("Error uploading file:", error);
        showSnackbar(`Error uploading file: ${error.message}`, "error");
      } finally {
        setUploading(false);
      }
    }
  }, [file, filename, documentType, metadata, onUploadSuccess, showSnackbar]);

  const analyzeDocument = useCallback(async (sasUrl, analyzerType) => {
    console.log(`Starting analysis for URL: ${sasUrl} as ${analyzerType}`);
    try {
      const response = await axiosInstance.post("/analyze", { url: sasUrl, analyzerType });
      console.log(`Analysis complete: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('Error during document analysis:', error.message);
      throw error;
    }
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" mb={2}>
        Upload your document
      </Typography>
      <Stack direction="column" spacing={2} alignItems="center">
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
          <MenuItem value="other">Other</MenuItem>
        </TextField>
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
         <Box {...getRootProps()} sx={{ border: '1px dashed',  p: 5, textAlign: 'center', cursor: 'pointer', width: '100%' }}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the files here ...</Typography>
          ) : (
            <Typography>Drag 'n' drop some files here, or click to select files</Typography>
          )}
        </Box>
        <TextField
          label="Filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          fullWidth
        />
       
        <Button
          variant="outlined"
          onClick={handleUpload}
          disabled={!file || !documentType || !filename || uploading}
        >
          Upload Document
        </Button>
        {uploading && <LinearProgress sx={{ width: "100%", mt: 2 }} />}
      </Stack>
    </Box>
  );
};

export default DocumentUploader;