import React from "react";
import { Typography, TextField, Divider, Box, Grid, Paper } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const LeadProfileBasicInfo = ({ document }) => {
  console.log(document)
  const {
    analysisResult: {
      fields: {
        FirstName: { value: firstName } = {},
        LastName: { value: lastName } = {},
        DocumentNumber: { content: documentNumber } = {},
        DateOfBirth: { value: dateOfBirth } = {},
        DateOfExpiration: { value: dateOfExpiration } = {},
        Sex: { value: sex } = {},
        Address: { value: { streetAddress, city, state: province, postalCode } = {} } = {},
        DateOfIssue: { content: issueDate } = {},
        DocumentDiscriminator: { content: discriminator } = {},
        Endorsements: { content: endorsements } = {},
        EyeColor: { content: eyeColor } = {},
        HairColor: { content: hairColor } = {},
        Region: { value: region } = {},
        Restrictions: { content: restrictions } = {},
        VehicleClassifications: { content: vehicleClass } = {},
      } = {},
    } = {},
  } = document;

  const basicInformationFields = [
    { label: "First Name", value: firstName },
    { label: "Last Name", value: lastName },
    { label: "Date of Birth", value: dateOfBirth, isDate: true },
    { label: "Sex", value: sex },
    { label: "Document Number", value: documentNumber },
  ];

  const locationFields = [
    { label: "Street Address", value: streetAddress },
    { label: "City", value: city },
    { label: "Province", value: province },
    { label: "Postal Code", value: postalCode },
  ];

  const renderTextField = (label, value) => {
    return (
      <TextField
        variant="outlined"
        label={label}
        value={value || ""}
        fullWidth
        disabled
      />
    );
  };

  const renderDatePicker = (label, value) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={label}
          value={value ? new Date(value) : null}
          renderInput={(params) => <TextField {...params} fullWidth disabled />}
          disabled
          fullWidth
        />
      </LocalizationProvider>
    );
  };

  const renderSection = (sectionLabel, fields) => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        {sectionLabel}
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            {field.isDate ? renderDatePicker(field.label, field.value) : renderTextField(field.label, field.value)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ mb: 5 }}>
      <Paper
        sx={{
          border: "solid",
          borderColor: "divider",
          p: 1,
          height: "73vh",
          overflow: "auto",
        }}
      >
        {renderSection("Basic Information", basicInformationFields)}
        <Divider />
        {renderSection("Location", locationFields)}
        <Divider />
      </Paper>
    </Box>
  );
};

export default LeadProfileBasicInfo;
