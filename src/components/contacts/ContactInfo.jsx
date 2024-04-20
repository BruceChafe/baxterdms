import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Divider,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ContactInfo = ({ contact, onSaveContactInfo, onInfoChange, isEditable }) => {
  const [editedContact, setEditedContact] = useState({ ...contact });

  useEffect(() => {
    if (contact.dob && typeof contact.dob.seconds === 'number' && typeof contact.dob.nanoseconds === 'number') {
      const convertedDate = new Date(contact.dob.seconds * 1000 + contact.dob.nanoseconds / 1000000);
      setEditedContact({
        ...contact,
        dob: convertedDate
      });
    } else {
      setEditedContact({
        ...contact,
        dob: null
      });
    }
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
    { label: "Primary Email", key: "primaryEmail" },
    { label: "Work Email", key: "workEmail" },
  ];

  useEffect(() => {
    if (editedContact) {
      onSaveContactInfo(editedContact);
    }
  }, [editedContact, onSaveContactInfo]);

  const handleFieldChange = (key, value) => {
    setEditedContact({
      ...editedContact,
      [key]: value,
    });
    onInfoChange(true);
  };

  const renderDatePicker = (label, key, value) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          variant="outlined"
          label={label}
          value={value || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          renderInput={(params) => <TextField {...params} fullWidth disabled={!isEditable} />}
          disabled={!isEditable}
        />
      </LocalizationProvider>
    );
  };

  const renderTextField = (label, key, value) => {
    if (key === 'dob') {
      return renderDatePicker(label, key, value);
    } else {
      return (
        <TextField
          variant="outlined"
          label={label}
          value={value || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          fullWidth
          disabled={!isEditable}
        />
      );
    }
  };

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
                editedContact[field.key]
              )}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ mb: 5}}>
      {renderSection("Basic Information", basicInformationFields)}
      <Divider sx={{ mt: 2, mb: 2 }} />
      {renderSection("Location", locationFields)}
      <Divider sx={{ mt: 2, mb: 2 }} />
      {renderSection("Contact Information", contactInformationFields)}
    </Box>
  );
};

export default ContactInfo;
