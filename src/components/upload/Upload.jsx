import React, { useState } from "react";
import Papa from "papaparse";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";

const UploadData = ({ showPanel, onClose, updateData, collectionName }) => {
  const [csvData, setCSVData] = useState([]);
  const [fileParsed, setFileParsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileUpload = (file) => {
    setFile(file);
    Papa.parse(file, {
      complete: (result) => {
        setCSVData(result.data);
        setFileParsed(true);
        console.log("Parsed CSV Data:", result.data);
      },
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
  };

  const handleUpload = async () => {
    if (!csvData.length) {
      console.error("No data available to upload.");
      return;
    }

    setIsLoading(true);
    const batch = writeBatch(db);
    csvData.forEach((entry) => {
      const docRef = doc(collection(db, collectionName));
      batch.set(docRef, entry);
    });

    try {
      await batch.commit();
      console.log("Batch upload completed successfully");
      updateData();
      handleReset();
    } catch (error) {
      console.error("Error uploading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCSVData([]);
    setFileParsed(false);
    onClose();
  };

  return (
    <Dialog
      open={showPanel}
      onClose={onClose}
      aria-labelledby="upload-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="upload-dialog-title">
        Import CSV Data
        <IconButton
          aria-label="close"
          sx={{ position: "absolute", top: "8px", right: "8px" }}
          onClick={handleReset}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
        {file && <Typography>{file.name}</Typography>}
      </DialogContent>
      {fileParsed && (
        <DialogActions>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
              >
                Upload
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Close
              </Button>
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default UploadData;
