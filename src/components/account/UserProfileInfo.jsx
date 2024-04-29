import React from "react";
import {
  Paper,
  Box,
  Typography,
  Divider,
  Grid,
  TextField,
} from "@mui/material";

const UserProfileInfo = ({ userDetails }) => {
  if (!userDetails) {
    return <div>Loading user details...</div>;
  }

  const {
    firstName,
    lastName,
    jobTitle,
    companyName,
    primaryEmail,
    companyNumber,
  } = userDetails;

  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
        <Typography variant="h5" mb={2}>
          Account Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName || ''}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Job Title"
              value={jobTitle}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={companyName}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Primary Email"
              value={primaryEmail}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Number"
              value={companyNumber}
              variant="outlined"
              disabled
            />
          </Grid>
        </Grid>
      </Paper>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
        <Typography variant="h5" mb={2}>
          Job Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Employee ID"
              value={""}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              value={""}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Manager"
              value={""}
              variant="outlined"
              disabled
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfileInfo;
