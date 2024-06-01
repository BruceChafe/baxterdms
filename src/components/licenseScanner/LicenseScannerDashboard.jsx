import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import LicenseUploader from "./LicenseUploader";
import LicenseList from "./LicenseList";
import LicenseDetail from "./LicenseDetail";
import TitleLayout from "../layouts/TitleLayout";
import axiosInstance from "../../axios";

const LicenseScannerDashboard = () => {
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // Define capturedImage here
  const [uploadedImage, setUploadedImage] = useState(null); // Define uploadedImage here

  const refreshLicenses = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const fetchLicenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/licenses');
      console.log('Fetched licenses:', response.data);
    } catch (error) {
      console.error('Error fetching licenses:', error);
      setError('Failed to fetch licenses.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses, refreshKey]);

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={<Typography variant="h4">License Scanner</Typography>}
        actionButtons={[]}
      />
      {isLoading && <Typography>Loading licenses...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ border: "solid", borderColor: "divider", mb: 2 }}>
              <LicenseUploader 
                onUploadSuccess={refreshLicenses} 
                setCapturedImage={setCapturedImage} 
                setUploadedImage={setUploadedImage} 
              />
            </Paper>
            <Paper sx={{ border: "solid", borderColor: "divider" }}>
              <LicenseList key={refreshKey} onSelectLicense={setSelectedLicense} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ border: "solid", borderColor: "divider", height: '100%' }}>
              <LicenseDetail license={selectedLicense} image={capturedImage || uploadedImage} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LicenseScannerDashboard;
