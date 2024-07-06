import React, { useState } from "react";
import { Box, Typography, Paper, Grid, CircularProgress, Alert, useMediaQuery, useTheme } from "@mui/material";
import LicenseUploader from "./LicenseUploader";
import TitleLayout from "../layouts/TitleLayout";

const LicenseScannerDashboard = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState("upload");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const refreshDocuments = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section));
  };

  return (
    <Box sx={{ mt: 3, mr: isSmallScreen ? 0 : 8 }}>
      <TitleLayout
        title={<Typography variant={isSmallScreen ? "h5" : "h4"}>License Scanner</Typography>}
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
      <Box sx={{ mt: 3, mb: 2 }}>
        <Grid container spacing={isSmallScreen ? 2 : 5} direction={isSmallScreen ? "column" : "row"}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ mb: 2, p: 3, border: "solid", borderColor: "divider" }}>
              <LicenseUploader
                onUploadSuccess={refreshDocuments}
                open={openSection === "upload"}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LicenseScannerDashboard;
