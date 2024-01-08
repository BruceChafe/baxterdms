// UploadContact Component
// This component provides a multi-step process for uploading contact, matching columns, and validating data.

// Importing necessary components and icons
import { Paper, IconButton, Box, Stepper, Step, StepLabel, Typography, Button, Toolbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

// Array defining the steps in the upload process
const steps = ['Upload file', 'Select header row', 'Match Columns', 'Validate data'];

// Functional component for the UploadContacts panel
function UploadContacts({ showPanel, onClose }) {

    // State for tracking the active step
    const [activeStep, setActiveStep] = React.useState(0);

    // Function to handle the "Next" button click
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    // Function to handle the "Back" button click
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Function to reset the active step to the beginning
    const handleReset = () => {
        setActiveStep(0);
    };

    // JSX for rendering the UploadContacts panel
    return (
        <>
            {/* Render the panel only if the showPanel prop is true */}
            {showPanel && (
                <Paper
                    elevation={3}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        width: '90%',
                        height: '90vh',
                        zIndex: 9999,
                    }}
                >
                    <Toolbar>
                        <Typography>
                            import
                        </Typography>
                    </Toolbar>
                    {/* Close button */}
                    <IconButton
                        aria-label="close"
                        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999 }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>

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

                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                {/* Empty space to align the "Reset" button to the right */}
                                <Box sx={{ flex: '1 1 auto' }} />
                                {/* Button to reset the steps */}
                                <Button onClick={handleReset}>Reset</Button>
                            </Box>
                        </React.Fragment>
                    ) : (
                        // If there are more steps to complete, render the current step and navigation buttons
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
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
                                <Box sx={{ flex: '1 1 auto' }} />
                                {/* "Next" button */}
                                <Button onClick={handleNext}>
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </Paper>
            )}
        </>
    );
}

// Export the UploadContacts component
export default UploadContacts;
