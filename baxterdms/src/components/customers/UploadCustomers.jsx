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
import React, { useState } from "react";
import Papa from "papaparse";

const steps = [
  "Upload file",
//   "Select header row",
//   "Match Columns",
//   "Validate data",
];

const UploadContacts = ({ showPanel, onClose, updateContacts }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [csvData, setCSVData] = useState([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCSVData([]);
  };

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        const extractedNames = result.data.map((row) => {
          return {
            ...row,
          };
        });
  
        setCSVData((prevData) => [...prevData, ...extractedNames]);
      },
      header: true,
    });
  };
  
  const handleFinish = () => {
    const promises = csvData.map((extractedName) => {
      return fetch("http://localhost:8000/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(extractedName),
      }).then((res) => res.json());
    });
  
    Promise.all(promises)
      .then((updatedContacts) => {
        updateContacts(updatedContacts);
        handleReset();
        onClose();
      })
      .catch((error) => {
        console.error("Error uploading CSV:", error);
      });
  };
  
  return (
    <>
      {showPanel && (
        <Paper
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            width: "90%",
            height: "90vh",
            zIndex: 9999,
          }}
        >
          <Toolbar>
            <Typography>import</Typography>
          </Toolbar>
          {/* Close button */}
          <IconButton
            aria-label="close"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 9999,
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />

          {/* Stepper component to display steps */}
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              // Return a Step component for each step in the array
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Conditional rendering based on the active step */}
          {activeStep === steps.length ? (
            // If all steps are completed, render the finish message and reset button
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {/* Empty space to align the "Reset" button to the right */}
                <Box sx={{ flex: "1 1 auto" }} />
                {/* "Finish" button */}
                <Button onClick={handleFinish}>Finish</Button>
              </Box>
            </React.Fragment>
          ) : (
            // If there are more steps to complete, render the current step and navigation buttons
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Step {activeStep + 1}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {/* "Back" button */}
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                {/* Empty space to align the following buttons to the right */}
                <Box sx={{ flex: "1 1 auto" }} />
                {/* "Next" button */}
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
      )}
    </>
  );
};

// Export the UploadContacts component
export default UploadContacts;