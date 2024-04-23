import React, { useState } from 'react';
import Papa from 'papaparse';
import { Paper, IconButton, Typography, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";

const UploadData = ({ showPanel, onClose, updateData, collectionName }) => {
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
      skipEmptyLines: true,
      dynamicTyping: true
    });
  };

  const handleUpload = async () => {
    console.log(`Attempting to upload data to ${collectionName}...`);
    if (!csvData.length) {
      console.error("No data available to upload.");
      return;
    }
  
    const batch = writeBatch(db);

    csvData.forEach((entry, index) => {
      const docRef = doc(collection(db, collectionName));
      batch.set(docRef, entry);
    });
  
    try {
      await batch.commit();
      console.log("Batch upload completed successfully");
      updateData();
      onClose();
      setFileParsed(false);
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
