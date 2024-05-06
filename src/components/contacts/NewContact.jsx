import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
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
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TitleLayout from "../layouts/TitleLayout";
import InputMask from "react-input-mask";
import { useSnackbar } from "../../context/SnackbarContext";
import { PhoneInputField } from "../fields/renderPhoneInputFields";

const NewContact = ({ onCloseForm, leadId }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
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
    primaryEmail: "",
    secondaryEmail: "",
    notes: "",
    leadIDs: leadId ? [leadId] : [],
  });

  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First Name is required.";
    if (!formData.lastName) errors.lastName = "Last Name is required.";
    if (!formData.mobilePhone) errors.mobilePhone = "Mobile Phone is required.";
    if (!formData.primaryEmail)
      errors.primaryEmail = "Primary Email is required.";
    return errors;
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "contacts"), formData);
      navigate(`/contacts/${docRef.id}`);
      showSnackbar("Contact created successfully.", "success");
    } catch (error) {
      console.error("Error adding new contact:", error);
      showSnackbar(`Failed to create contact: ${error.message}`, "error");
    }
  };

  const provinces = [
    { code: "AB", name: "Alberta" },
    { code: "BC", name: "British Columbia" },
    { code: "MB", name: "Manitoba" },
    { code: "NB", name: "New Brunswick" },
    { code: "NL", name: "Newfoundland and Labrador" },
    { code: "NT", name: "Northwest Territories" },
    { code: "NS", name: "Nova Scotia" },
    { code: "NU", name: "Nunavut" },
    { code: "ON", name: "Ontario" },
    { code: "PE", name: "Prince Edward Island" },
    { code: "QC", name: "Quebec" },
    { code: "SK", name: "Saskatchewan" },
    { code: "YT", name: "Yukon" },
  ];

  const genders = [
    { code: "male", name: "Male" },
    { code: "female", name: "Female" },
    { code: "non-binary", name: "Non-binary" },
    { code: "na", name: "Prefer not to say" },
    { code: "other", name: "Other" },
  ];

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout title={<Typography variant="h4">New Contact</Typography>} />
      <Box sx={{ mt: 3 }}>
        <form onSubmit={handleSubmit} noValidate>
          <Paper
            sx={{
              border: "solid",
              borderColor: "divider",
              height: "73vh",
              overflow: "auto",
              p: 3,
              mb: 2,
            }}
          >
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
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName || ""}
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
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName || ""}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  id="gender-select"
                  options={genders}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) =>
                    handleInputChange({
                      target: {
                        name: "gender",
                        value: value ? value.code : "",
                      },
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gender"
                      name="gender"
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
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
                        dob: date ? date.toDate() : null, // Converts Dayjs object to Date object
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Divider sx={{ mt: 2, mb: 2 }} />
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
                <PhoneInputField
                  label="Mobile Phone"
                  name="mobilePhone"
                  value={formData.mobilePhone}
                  onChange={handleInputChange}
                  error={!!formErrors.mobilePhone}
                  helperText={formErrors.mobilePhone}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PhoneInputField
                  label="Home Phone"
                  name="homePhone"
                  value={formData.homePhone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PhoneInputField
                  label="Work Phone"
                  name="workPhone"
                  value={formData.workPhone}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Primary Email"
                  name="primaryEmail"
                  value={formData.primaryEmail}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!formErrors.primaryEmail}
                  helperText={formErrors.primaryEmail || ""}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Secondary Email"
                  name="secondaryEmail"
                  value={formData.secondaryEmail}
                  onChange={handleInputChange}
                  fullWidth
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

            <Divider sx={{ mt: 2, mb: 2 }} />
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
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  id="province-select"
                  options={provinces}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) =>
                    handleInputChange({
                      target: {
                        name: "gender",
                        value: value ? value.code : "",
                      },
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Province"
                      name="province"
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
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
          </Paper>
          <Paper
            sx={{ mt: 2, mb: 2, p: 2, border: "solid", borderColor: "divider" }}
          >
            <Grid container>
              <Button variant="outlined" onClick={onCloseForm} sx={{ mr: 2 }}>
                Back
              </Button>
              <Button type="submit" variant="outlined">
                Create
              </Button>
            </Grid>
          </Paper>
        </form>
      </Box>
    </Box>
  );
};

export default NewContact;
