import React, { useState } from "react";
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  FormLabel,
  Divider,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TitleLayout from "../layouts/TitleLayout";

const NewContact = ({ onCloseForm, onNewContactCreated }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: null,
    streetAddress: "",
    postalCode: "",
    city: "",
    province: "",
    country: "",
    preferredLanguage: "",
    preferredContact: "",
    mobilePhone: "",
    homePhone: "",
    workPhone: "",
    email: "",
    notes: "",
  });
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/contacts", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        onNewContactCreated(data.id);
      })
      .catch((error) => {
        console.error("Error creating new contact:", error);
      });
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout title={<Typography variant="h4">New Contact</Typography>} />
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ pl: 1, pr: 1, mt: 2 }}>
          <Box mb={1} mt={1} p={1}>
            <Typography variant="h5" mb={2}>
              Identity
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  onChange={handleInputChange}
                  fullWidth
                  label="First Name"
                  name="firstName"
                  variant="outlined"
                  required
                  error={firstNameError}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  onChange={handleInputChange}
                  fullWidth
                  label="Middle Name"
                  name="middleName"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  onChange={handleInputChange}
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  variant="outlined"
                  required
                  error={lastNameError}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="contact-gender-select">Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={handleInputChange}
                    labelId="contact-gender-select"
                    label="Gender"
                    name="gender"
                    variant="outlined"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="na">Prefer not to say</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="EN"
                >
                  <DatePicker
                    label="Date of Birth"
                    inputVariant="outlined"
                    value={formData.dob}
                    onChange={(date) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        dob: date,
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
      <Divider />
      <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
        <Box mb={1} mt={1} p={1}>
          <Typography variant="h5" mb={2}>
            Location
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                onChange={handleInputChange}
                fullWidth
                label="Street Address"
                name="streetAddress"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                onChange={handleInputChange}
                fullWidth
                label="Postal Code"
                name="postalCode"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                onChange={handleInputChange}
                fullWidth
                label="City"
                name="city"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="contact-province-select">Province</InputLabel>
                <Select
                  value={formData.province}
                  onChange={handleInputChange}
                  labelId="contact-province-select"
                  label="Province"
                  name="province"
                  variant="outlined"
                >
                  <MenuItem value="AB">Alberta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="contact-country-select">Country</InputLabel>
                <Select
                  value={formData.country}
                  onChange={handleInputChange}
                  labelId="contact-country-select"
                  label="Country"
                  name="country"
                  variant="outlined"
                >
                  <MenuItem value="CA">Canada</MenuItem>
                  <MenuItem value="US">United States of America</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Divider />

      <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
        <Box mb={1} mt={1} p={1}>
          <Typography variant="h5" mb={2}>
            Contact Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Preferred Language</FormLabel>
                <RadioGroup
                  aria-label="Preferred Language"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="english"
                    control={<Radio />}
                    label="English"
                  />
                  <FormControlLabel
                    value="french"
                    control={<Radio />}
                    label="French"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Preferred Contact Method
                </FormLabel>
                <RadioGroup
                  aria-label="Preferred Contact Method"
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="sms"
                    control={<Radio />}
                    label="SMS"
                  />
                  <FormControlLabel
                    value="email"
                    control={<Radio />}
                    label="Email"
                  />
                  <FormControlLabel
                    value="phone"
                    control={<Radio />}
                    label="Phone"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                onChange={handleInputChange}
                fullWidth
                label="Mobile Phone"
                name="mobilePhone"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                onChange={handleInputChange}
                fullWidth
                label="Home Phone"
                name="homePhone"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                onChange={handleInputChange}
                fullWidth
                label="Work Phone"
                name="workPhone"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={handleInputChange}
                fullWidth
                label="Email Address"
                name="email"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={handleInputChange}
                fullWidth
                label="Notes"
                name="notes"
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Divider />
      <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
        <Box mb={1} mt={1} p={1}>
          <Grid container>
            <Button variant="outlined" onClick={onCloseForm} sx={{ mr: 2 }}>
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Create
            </Button>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewContact;
