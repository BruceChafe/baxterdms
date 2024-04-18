import React, { useState } from 'react';
import Papa from 'papaparse';
import { Paper, IconButton, Typography, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";

const UploadData = ({ showPanel, onClose, updateData }) => {
  const [csvData, setCSVData] = useState([]);
  const [fileParsed, setFileParsed] = useState(false);

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        setCSVData(result.data);
        setFileParsed(true);
        console.log("Parsed CSV Data:", result.data);
      },
      
      header: true,
    });
  };

  const handleUpload = async () => {
    console.log("Attempting to upload data...");
    if (!csvData.length) {
      console.error("No data available to upload.");
      return;
    }
  
    const batch = writeBatch(db); // Correct way to create a new batch operation
  
    csvData.forEach((entry, index) => {
      if (entry.dob) { // Ensure the date of birth is properly converted
        entry.dob = new Date(entry.dob);
      }
      const docRef = doc(collection(db, "contacts")); // Create a document reference
      batch.set(docRef, entry); // Add the set operation to the batch
    });
  
    try {
      await batch.commit(); // Commit the batch operation
      console.log("Batch upload completed successfully");
      updateData(); // Trigger data refresh
      onClose(); // Close the upload modal
      setFileParsed(false); // Reset the file parsed flag
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(`Failed to upload data: ${error.message}`);
    }
  };
  
  
  return (
    <>
      {showPanel && (
        <Paper sx={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", width: "90%", maxHeight: "90vh", zIndex: 9999, overflow: "auto" }}>
          <IconButton aria-label="close" sx={{ position: "absolute", top: "10px", right: "10px", zIndex: 9999 }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Import CSV Data
          </Typography>
          <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e.target.files[0])} />
          {fileParsed && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
              <Button variant="outlined" onClick={onClose}>Close</Button>
            </Box>
          )}
        </Paper>
      )}
    </>
  );
};

export default UploadData;
