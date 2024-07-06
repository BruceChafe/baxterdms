import React, { useState } from "react";
import { Box, Typography, CircularProgress, Alert, useMediaQuery, useTheme, Paper, Button } from "@mui/material";
import DocumentUploader from "./LicenseUploader";
import TitleLayout from "../layouts/TitleLayout";

const LicenseScannerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mt: 3, mx: isSmallScreen ? 1 : 8 }}>
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
        <Paper sx={{ p: 3, border: "solid", borderColor: "divider" }}>
          <DocumentUploader onUploadSuccess={() => setIsLoading(false)} setIsLoading={setIsLoading} setError={setError} />
        </Paper>
      </Box>
    </Box>
  );
};

export default LicenseScannerDashboard;
