import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import DocumentUploader from "./DocumentUploader";
import DocumentList from "./DocumentList";
import DocumentDetail from "./DocumentDetail";
import TitleLayout from "../layouts/TitleLayout";
import axiosInstance from "../../axios";

const DocumentDashboard = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshDocuments = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/documents');
      console.log('Fetched documents:', response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to fetch documents.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshKey]);

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={<Typography variant="h4">Document Archive</Typography>}
        actionButtons={[]}
      />
      {isLoading && <Typography>Loading documents...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ border: "solid", borderColor: "divider", mb: 2 }}>
              <DocumentUploader onUploadSuccess={refreshDocuments} />
            </Paper>
            <Paper sx={{ border: "solid", borderColor: "divider" }}>
              <DocumentList key={refreshKey} onSelectDocument={setSelectedDocument} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ border: "solid", borderColor: "divider", height: '100%' }}>
              <DocumentDetail document={selectedDocument} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DocumentDashboard;
