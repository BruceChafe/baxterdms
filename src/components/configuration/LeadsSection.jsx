import React, { useState } from "react";
import { Button, Paper, Typography, CircularProgress, Alert, Box } from "@mui/material";
import TransferList from "../transferList/TransferList";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const LeadsSection = ({
  label,
  unactiveData,
  activeData,
  setUnactiveData,
  setActiveData,
}) => {
  const [saveStatus, setSaveStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const field = label.replace(" Management", "").replace(" ", "");
    const docRef = doc(db, 'leadConfig', 'configData');
    const dataToSend = {
      [`${field}Unactive`]: unactiveData,
      [`${field}Active`]: activeData,
    };

    try {
      await updateDoc(docRef, dataToSend);
      setSaveStatus("success");
    } catch (error) {
      console.error("Error updating configuration:", error);
      setSaveStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
        <Typography variant="h5" mb={2}>{label}</Typography>
        <TransferList
          leftItems={unactiveData}
          rightItems={activeData}
          setLeftItems={setUnactiveData}
          setRightItems={setActiveData}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
        {saveStatus && (
          <Alert
            severity={saveStatus === "success" ? "success" : "error"}
            sx={{ mt: 2 }}
          >
            {saveStatus === "success"
              ? "Changes saved successfully."
              : "Failed to save changes. Please try again."}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default LeadsSection;