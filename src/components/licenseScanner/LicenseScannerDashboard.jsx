import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import CameraCapture from "./utilites/CameraCapture";
import axios from "axios";
import TitleLayout from "../layouts/TitleLayout";

const LicenseScannerDashboard = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const handleCapture = (imageSrc) => {
    setCapturedImage(imageSrc);
    sendToAzure(imageSrc);
  };

  const sendToAzure = async (imageSrc) => {
    const formRecognizerEndpoint = process.env.REACT_APP_AZURE_FORM_RECOGNIZER_ENDPOINT;
    const formRecognizerKey = process.env.REACT_APP_AZURE_FORM_RECOGNIZER_KEY;
    const endpoint = `${formRecognizerEndpoint}/formrecognizer/v2.1/prebuilt/idDocument/analyze`;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoint, imageSrc, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Ocp-Apim-Subscription-Key": formRecognizerKey,
        },
      });
      setResponse(response.data);
    } catch (error) {
      console.error("Error sending to Azure:", error);
      setError("Failed to send image to Azure.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={<Typography variant="h4">License Scanner Dashboard</Typography>}
        actionButtons={[]}
      />
      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ border: "solid", borderColor: "divider", mb: 2 }}>
              <CameraCapture onCapture={handleCapture} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ border: "solid", borderColor: "divider", height: "100%" }}>
              {capturedImage && (
                <div>
                  <Typography variant="h6">Captured Image:</Typography>
                  <img src={capturedImage} alt="Captured" style={{ width: "100%" }} />
                </div>
              )}
              {response && (
                <div>
                  <Typography variant="h6">Azure Response:</Typography>
                  <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LicenseScannerDashboard;
