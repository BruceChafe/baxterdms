import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const NewContact = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDOB] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [preferredContact, setPreferredContact] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [homePhone, setHomePhone] = useState("");
  const [workPhone, setWorkPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const contact = {
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      address: { streetAddress, postalCode, city, province, country },
      preferences: { preferredLanguage, preferredContact },
      phoneNumbers: { mobilePhone, homePhone, workPhone },
      email,
      notes,
    };

    fetch("http://localhost:8000/contacts", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(contact),
    });
  };

  return (
    <Paper sx={{ mt: 2, mr: 2, p: 1 }}>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ m: 2 }}>
          New Contact
        </Typography>

        {/* Identity Section */}
        <Paper elevation={12} style={{ margin: "20px", padding: "15px" }}>
          <Typography style={{ padding: "5px" }}>Identity</Typography>

          <Grid container>
            <Grid item md={3}>
              <Typography style={{ padding: "5px" }}>First Name</Typography>
              <TextField
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                label="First Name"
                variant="outlined"
                required
                error={firstNameError}
              />
            </Grid>
            <Grid item md={0.5} />
            <Grid item md={3}>
              <Typography style={{ padding: "5px" }}>Middle Name</Typography>
              <TextField
                onChange={(e) => setMiddleName(e.target.value)}
                fullWidth
                label="Middle Name"
                variant="outlined"
              />
            </Grid>
            <Grid item md={0.5} />
            <Grid item md={3}>
              <Typography style={{ padding: "5px" }}>Last Name</Typography>
              <TextField
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                label="Last Name"
                variant="outlined"
                required
                error={lastNameError}
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item md={4}>
              <Typography style={{ padding: "5px" }}>Gender</Typography>
              <FormControl fullWidth>
                <InputLabel id="contact-gender-select">Gender</InputLabel>
                <Select
                  onChange={(e) => setGender(e.target.value)}
                  labelId="contact-gender-select"
                  id="contact-gender-select"
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="na">Prefer not to say</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={1} />
            <Grid item md={4}>
              <Typography style={{ padding: "5px" }}>Date of Birth</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker onChange={(e) => setDOB(e.target.value)} />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>

        {/* Location Section */}
        <Paper elevation={12} style={{ margin: "20px", padding: "15px" }}>
          <Typography style={{ padding: "5px" }}>Location</Typography>

          <Typography style={{ padding: "5px" }}>Street Address</Typography>
          <TextField
            onChange={(e) => setStreetAddress(e.target.value)}
            fullWidth
            label="Street Address"
            variant="outlined"
            required
          />

          <Typography style={{ padding: "5px" }}>Postal Code</Typography>
          <TextField
            onChange={(e) => setPostalCode(e.target.value)}
            fullWidth
            label="Postal Code"
            variant="outlined"
          />

          <Typography style={{ padding: "5px" }}>City</Typography>
          <TextField
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            label="City"
            variant="outlined"
            required
          />

          <Typography style={{ padding: "5px" }}>Province</Typography>
          <FormControl fullWidth>
            <InputLabel id="contact-province-select">Province</InputLabel>
            <Select
              onChange={(e) => setProvince(e.target.value)}
              labelId="contact-province-select"
              id="contact-province-Provinceect"
              label="Province"
            >
              <MenuItem value="AB">Alberta</MenuItem>
              <MenuItem value="BC">British Columbia</MenuItem>
              <MenuItem value="MB">Manitoba</MenuItem>

              <MenuItem value="NB">New Brunswick</MenuItem>
              <MenuItem value="NL">Newfoundland and Labrador</MenuItem>
              <MenuItem value="NS">Nova Scotia</MenuItem>
              <MenuItem value="NT">Northwest Territories</MenuItem>
              <MenuItem value="NU">Nunavut</MenuItem>
              <MenuItem value="ON">Ontario</MenuItem>
              <MenuItem value="PE">Prince Edward Island</MenuItem>
              <MenuItem value="QC">Quebec</MenuItem>
              <MenuItem value="SK">Saskatchewan</MenuItem>
              <MenuItem value="YT">Yukon</MenuItem>
              </Select>
          </FormControl>

          <Typography style={{ padding: "5px" }}>Country</Typography>
          <FormControl fullWidth>
            <InputLabel id="contact-country-select">Country</InputLabel>
            <Select
              onChange={(e) => setCountry(e.target.value)}
              labelId="contact-country-select"
              id="contact-country-select"
              label="Country"
            >
              <MenuItem value="CA">Canada</MenuItem>
              <MenuItem value="US">United States of America</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Contact Information Section */}
        <Paper elevation={12} style={{ margin: "20px", padding: "15px" }}>
          <Typography style={{ padding: "5px" }}>
            Contact Information
          </Typography>

          <Grid container>
            <Grid item md={3}>
              <FormControl>
                <FormLabel>Preferred Language</FormLabel>
                <RadioGroup
                  onChange={(e) => setPreferredLanguage(e.target.value)}
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
            <Grid item md={3}>
              <FormControl>
                <FormLabel>Preferred Contact Method</FormLabel>
                <RadioGroup
                  onChange={(e) => setPreferredContact(e.target.value)}
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
          </Grid>

          <FormLabel>Mobile Phone</FormLabel>
          <TextField
            onChange={(e) => setMobilePhone(e.target.value)}
            fullWidth
            label="Mobile Phone"
            variant="outlined"
          />

          <FormLabel>Home Phone</FormLabel>
          <TextField
            onChange={(e) => setHomePhone(e.target.value)}
            fullWidth
            label="Home Phone"
            variant="outlined"
          />

          <FormLabel>Work Phone</FormLabel>
          <TextField
            onChange={(e) => setWorkPhone(e.target.value)}
            fullWidth
            label="Work Phone"
            variant="outlined"
          />

          <FormLabel>Email Address</FormLabel>
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            label="Email Address"
            variant="outlined"
            required
          />

          <FormLabel>Notes</FormLabel>
          <TextField
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            label="Notes"
            variant="outlined"
            multiline
            rows={4}
          />

          <Button
            type="submit"
            color="secondary"
            variant="outlined"
            onClick={() => console.log("submit clicked")}
          >
            Submit
          </Button>
        </Paper>
      </form>
    </Paper>
  );
};

export default NewContact;