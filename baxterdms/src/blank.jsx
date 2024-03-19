import React from "react";
import { Box, Typography, Divider, Grid, TextField } from "@mui/material";

const ContactLead = ({ contact }) => {
  const leadNumbers = contact?.leadNumbers || [];

  const renderTextField = (label, value) => (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      fullWidth
      disabled
    />
  );

  const renderSection = (sectionLabel, data) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {sectionLabel}
      </Typography>
      {data.map((leadNumber, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item xs={12} sm={6}>
            {renderTextField("Lead", leadNumber)}
          </Grid>
        </Grid>
      ))}
      {data.length === 0 && (
        <Typography>No leads found for the specified contact.</Typography>
      )}
      <Divider sx={{ mt: 2, mb: 2 }} />
    </Box>
  );

  return <Box>{renderSection("Leads", leadNumbers)}</Box>;
};

export default ContactLead;
