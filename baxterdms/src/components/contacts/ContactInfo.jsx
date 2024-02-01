import React, { useState } from "react";
import { Typography, TextField, Divider, Box, Button } from "@mui/material";

const ContactInfo = ({ contact, onUpdateContact }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContact, setEditedContact] = useState({ ...contact });

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

  const dmsFields =[
    { label: "DMS ID", key: "dmsID" },
  ]

  const handleEditToggle = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleFieldChange = (key, value) => {
    setEditedContact({
      ...editedContact,
      [key]: value,
    });
  };

  const handleSave = () => {
    fetch(`http://localhost:8000/contacts/${contact.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(editedContact),
    })
      .then((response) => response.json())
      .then((updatedContact) => {
        onUpdateContact(updatedContact);
        setIsEditMode(false);
      })
      .catch((error) => {
        console.error("Error updating contact:", error);
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
      {fields.map((field) => (
        <React.Fragment key={field.label}>
          {renderTextField(field.label, field.key, editedContact[field.key], field.isReadOnly)}
        </React.Fragment>
      ))}
      <Divider sx={{ mt: 1, mb: 1, width: 1 / 2 }} />
    </Box>
  );

  return (
    <Box sx={{ width: "100%", mr: 2 }}>
      <Button onClick={isEditMode ? handleSave : handleEditToggle} variant="outlined">
        {isEditMode ? "Save" : "Edit"}
      </Button>

      {renderSection("Basic Information", basicInformationFields)}
      {renderSection("Location", locationFields)}
      {renderSection("Contact Information", contactInformationFields)}
      {renderSection("DMS ID", dmsFields)}
    </Box>
  );
};

export default ContactInfo;
