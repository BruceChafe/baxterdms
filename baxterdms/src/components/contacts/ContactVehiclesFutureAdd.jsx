import React, { useState } from "react";
import { Typography, TextField, Divider, Box, Button } from "@mui/material";

const Vehicle = ({ vehicle }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddNewMode, setIsAddNewMode] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState(false);

  const vehicleInformation = [
    { label: "DMS ID:", key: "dmsID" },
    { label: "Currently Owned:", key: "currentlyOwned" },
    { label: "VIN:", key: "id" },
    { label: "Year:", key: "vehicleYear" },
    { label: "Make:", key: "vehicleMake" },
    { label: "Model:", key: "vehicleModel" },
    { label: "KMs:", key: "vehicleKMs" },
  ];

  const handleToggle = () => {
    setIsEditMode, setIsAddNewMode((prevMode) => !prevMode);
  };

  const handleFieldChange = (key, value) => {
    setEditedVehicle,
      setIsAddNewMode({
        ...editedVehicle,
        [key]: value,
      });
  };

  const handleSave = () => {
    fetch("http://localhost:8000/vehicles", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(editedVehicle),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((updatedVehicle) => {
        // onUpdateVehicle(updatedVehicle);
        setIsEditMode(false);
      })
      .catch((error) => {
        console.error("Error updating Vehicle:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      });
  };

  const renderTextField = (label, key, value, isReadonly = true) => (
    <TextField
      variant="standard"
      label={label}
      value={value}
      onChange={(e) => handleFieldChange(key, e.target.value)}
      InputProps={{
        readOnly: !isEditMode,
      }}
      sx={{ mr: 2, width: "15%" }}
      disabled={!isEditMode}
    />
  );

  const renderSection = (sectionLabel, fields) => (
    <Box label={sectionLabel} sx={{ width: "100%", mr: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {sectionLabel}
      </Typography>
      {fields.map((field, index) => (
        <React.Fragment key={field.label}>
          {renderTextField(
            field.label,
            field.key,
            editedVehicle[field.key],
            field.isReadOnly
          )}
          {(index + 1) % 3 === 0 && (
            <Typography display="block" sx={{ mb: 2 }} />
          )}
        </React.Fragment>
      ))}
      <Divider sx={{ mt: 1, mb: 1, width: 1 / 2 }} />
    </Box>
  );

  return (
    <Box sx={{ width: "100%", mr: 2 }}>
      <Button
        onClick={isEditMode ? handleSave : handleToggle}
        variant="outlined"
      >
        {isEditMode ? "Save" : "Edit"}
      </Button>
      <Button variant="outlined">Add New Vehicle</Button>

      {renderSection("Vehicle Information", vehicleInformation)}
    </Box>
  );
};

export default Vehicle;
