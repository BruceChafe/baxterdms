import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Divider,
  Box,
  Grid,
  Paper,
} from "@mui/material";

const ContactInfo = ({
  contact,
  onSaveContactInfo,
  onInfoChange,
  isEditable,
}) => {
  const [editedContact, setEditedContact] = useState({ ...contact });

  useEffect(() => {
    setEditedContact({ ...contact });
  }, [contact]);

  const handleFieldChange = (key, value) => {
    setEditedContact((prev) => ({
      ...prev,
      [key]: value,
    }));
    onInfoChange(true);
  };

  const renderTextField = (label, key, value) => (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      onChange={(e) => handleFieldChange(key, e.target.value)}
      fullWidth
      disabled={!isEditable}
    />
  );

  const renderSection = (sectionLabel, fields) => (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" mb={2}>
          {sectionLabel}
        </Typography>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.label}>
              {renderTextField(
                field.label,
                field.key,
                editedContact[field.key] || ""
              )}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );

  return (
    <Box>
      {renderSection("Basic Information", [
        { label: "First Name", key: "firstName" },
        { label: "Middle Name", key: "middleName" },
        { label: "Last Name", key: "lastName" },
        { label: "Gender", key: "gender" },
        { label: "Date of Birth", key: "dob" },
      ])}
      <Divider sx={{ mt: 2, mb: 2 }} />
      {renderSection("Location", [
        { label: "Street Address", key: "streetAddress" },
        { label: "City", key: "city" },
        { label: "Province", key: "province" },
        { label: "Postal Code", key: "postalCode" },
      ])}
      <Divider sx={{ mt: 2, mb: 2 }} />
      {renderSection("Contact Information", [
        { label: "Mobile Phone", key: "mobilePhone" },
        { label: "Home Phone", key: "homePhone" },
        { label: "Work Phone", key: "workPhone" },
        { label: "Primary Email", key: "primaryEmail" },
        { label: "Work Email", key: "workEmail" },
      ])}
    </Box>
  );
};

export default ContactInfo;
