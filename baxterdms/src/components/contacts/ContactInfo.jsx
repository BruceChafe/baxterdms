import React, { useState, useEffect } from "react";
import { Typography, TextField, Divider, Box, Grid, Paper } from "@mui/material";

const ContactInfo = ({ contact, onSaveContactInfo }) => {
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

  const handleFieldChange = (key, value) => {
    setEditedContact({
      ...editedContact,
      [key]: value,
    });
  };

  const renderTextField = (label, key, value) => (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      onChange={(e) => handleFieldChange(key, e.target.value)}
      fullWidth
    />
  );

  useEffect(() => {
    if (editedContact) {
      onSaveContactInfo(editedContact);
    }
  }, [editedContact, onSaveContactInfo]);

  const renderSection = (sectionLabel, fields) => (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
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
      </Paper>
    </Box>
  );

    return (
      <Box>
        {renderSection("Basic Information", basicInformationFields)}
        <Divider sx={{ mt: 2, mb: 2 }} />
        {renderSection("Location", locationFields)}
        <Divider sx={{ mt: 2, mb: 2 }} />
        {renderSection("Contact Information", contactInformationFields)}
      </Box>
    );

};

export default ContactInfo;
