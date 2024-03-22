import React, { useState } from "react";
import Papa from "papaparse";
import { Paper, IconButton, Box, Stepper, Step, StepLabel, Typography, Button, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Improved UploadData component with structured and optimized code
const UploadData = ({ showPanel, onClose, updateData, uploadUrl, uploadMethod, stepLabels }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCSVData] = useState([]);

  // Proceed to the next step
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);

  // Go back to the previous step
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  // Reset the steps and clear CSV data
  const handleReset = () => {
    setActiveStep(0);
    setCSVData([]);
  };

  // Handle CSV file upload and parse the file
  const handleFileUpload = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        setCSVData(result.data);
      },
      header: true,
    });
  };

  // Handle the final step and upload data
  const handleFinish = () => {
    Promise.all(csvData.map((data) =>
      fetch(uploadUrl, {
        method: uploadMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json())
    ))
    .then((updatedData) => {
      updateData(updatedData);
      handleReset();
      onClose();
    })
    .catch((error) => {
      console.error("Error uploading data:", error);
    });
  };

  // Render the component UI
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
            <CompletionActions onFinish={handleFinish} />
          ) : (
            <StepActions 
              activeStep={activeStep} 
              stepCount={stepLabels.length} 
              onBack={handleBack} 
              onNext={handleNext} 
            />
          )}
        </Paper>
      )}
    </>
  );
};

// Component for step actions
const StepActions = ({ activeStep, stepCount, onBack, onNext }) => (
  <Box>
    <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
      <Button color="inherit" disabled={activeStep === 0} onClick={onBack} sx={{ mr: 1 }}>
        Back
      </Button>
      <Box sx={{ flex: "1 1 auto" }} />
      <Button onClick={onNext}>{activeStep === stepCount - 1 ? "Finish" : "Next"}</Button>
    </Box>
  </Box>
);

// Component for completion actions
const CompletionActions = ({ onFinish }) => (
  <Box>
    <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
      <Box sx={{ flex: "1 1 auto" }} />
      <Button onClick={onFinish}>Finish</Button>
    </Box>
  </Box>
);

export default UploadData;
