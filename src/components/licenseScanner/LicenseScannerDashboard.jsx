import React, { useState } from "react";
import { Box, Typography, Paper, Grid, CircularProgress, Alert } from "@mui/material";
import DocumentUploader from "./DocumentUploader";
import DocumentList from "./DocumentList";
import DocumentDetail from "./DocumentDetail";
import TitleLayout from "../layouts/TitleLayout";

const DocumentDashboard = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState("upload");

  const refreshDocuments = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section));
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={<Typography variant="h4">License Scanner</Typography>}
        actionButtons={[]}
      />
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Box sx={{ mt: 3, mb: 2,  }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ mb: 2, p: 3,border: "solid", borderColor: "divider" }}>
              <DocumentUploader
                onUploadSuccess={refreshDocuments}
                open={openSection === "upload"}
                onToggle={() => toggleSection("upload")}
              />
            </Paper>
            <Paper sx={{ p: 3, border: "solid", borderColor: "divider" }}>
              <DocumentList
                key={refreshKey}
                onSelectDocument={setSelectedDocument}
                open={openSection === "list"}
                onToggle={() => toggleSection("list")}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '80vh', overflow: 'auto', border: "solid", borderColor: "divider" }}>
              <DocumentDetail document={selectedDocument} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DocumentDashboard;
