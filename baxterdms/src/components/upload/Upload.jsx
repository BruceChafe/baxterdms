import React, { useState } from "react";
import Papa from "papaparse";
import {
  Paper,
  IconButton,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UploadData = ({ showPanel, onClose, updateData, uploadUrl, uploadMethod, stepLabels }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCSVData] = useState([]);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const handleReset = () => {
    setActiveStep(0);
    setCSVData([]);
  };

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        setCSVData(result.data);
      },
      header: true,
    });
  };

  const handleFinish = () => {
    Promise.all(
      csvData.map((data) =>
        fetch(uploadUrl, {
          method: uploadMethod,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((res) => res.json())
      )
    )
      .then((updatedData) => {
        updateData(updatedData);
        handleReset();
        onClose();
      })
      .catch((error) => {
        console.error("Error uploading data:", error);
      });
  };

  return (
    <>
      {showPanel && (
        <Paper sx={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", width: "90%", height: "90vh", zIndex: 9999 }}>
          <Toolbar>
            <Typography>Import</Typography>
          </Toolbar>
          <IconButton aria-label="close" sx={{ position: "absolute", top: "10px", right: "10px", zIndex: 9999 }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />

          <Stepper activeStep={activeStep}>
            {stepLabels.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === stepLabels.length ? (
            <Box>
              <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleFinish}>Finish</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext}>{activeStep === stepLabels.length - 1 ? "Finish" : "Next"}</Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}
    </>
  );
};

export default UploadData;
