import React, { useState, useEffect } from "react";
import { Typography, TextField, Divider, Box, Button, Grid } from "@mui/material";

const ContactInfo = ({ contact, onUpdateContact }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContact, setEditedContact] = useState({ ...contact });

  useEffect(() => {
    setEditedContact({ ...contact });
  }, [contact]);

  const basicInformationFields = [
    { label: "First Name", key: "firstName" },
    { label: "Middle Name", key: "middleName" },
    { label: "Last Name", key: "lastName" },
    { label: "Gender", key: "gender" },
    { label: "Date of Birth", key: "dob" },
  ];

  const locationFields = [
    { label: "Street Address", key: "streetAddress" },
    { label: "City", key: "city" },
    { label: "Province", key: "province" },
    { label: "Postal Code", key: "postalCode" },
  ];

  const contactInformationFields = [
    { label: "Mobile Phone", key: "mobilePhone" },
    { label: "Home Phone", key: "homePhone" },
    { label: "Work Phone", key: "workPhone" },
    { label: "Primary Email", key: "email" },
    { label: "Work Email", key: "workEmail" },
  ];

  const handleEditToggle = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleFieldChange = (key, value) => {
    setEditedContact({
      ...editedContact,
      [key]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/contacts/${contact.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(editedContact),
      });
      if (!response.ok) {
        throw new Error("Failed to save contact data");
      }
      const updatedContact = await response.json();
      onUpdateContact(updatedContact);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const renderTextField = (label, key, value) => (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      onChange={(e) => handleFieldChange(key, e.target.value)}
      InputProps={{
        readOnly: !isEditMode,
      }}
      fullWidth
      disabled={!isEditMode}
    />
  );

  const renderSection = (sectionLabel, fields) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {sectionLabel}
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} key={field.label}>
            {renderTextField(field.label, field.key, editedContact[field.key])}
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ mt: 2, mb: 2 }} />
    </Box>
  );

  return (
    <Box>
      <Button onClick={isEditMode ? handleSave : handleEditToggle} variant="outlined" sx={{ mb: 2 }}>
        {isEditMode ? "Save" : "Edit"}
      </Button>

      {renderSection("Basic Information", basicInformationFields)}
      {renderSection("Location", locationFields)}
      {renderSection("Contact Information", contactInformationFields)}
    </Box>
  );
};

export default ContactInfo;
