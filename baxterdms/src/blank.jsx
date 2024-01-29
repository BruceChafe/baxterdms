import React, { useState } from "react";
import {
  Typography,
  TextField,
  Divider,
  Box,
  Button,
} from "@mui/material";

const ContactInfo = ({ contact }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditToggle = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  return (
    <Box sx={{ width: "100%", mr: 2 }}>
      <Button onClick={handleEditToggle} variant="outlined">
        {isEditMode ? "Save" : "Edit"}
      </Button>

      <Box label="basicInformation" sx={{ width: "100%", mr: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Information
        </Typography>

       <TextField
          variant="standard"
          label="First Name"
          defaultValue={contact.firstName}
          InputProps={{
            readOnly: !isEditMode,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled={!isEditMode}
        />
        <TextField
          variant="standard"
          label="Middle Name"
          defaultValue={contact.middleName}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
        <TextField
          label="Last Name"
          variant="standard"
          defaultValue={contact.lastName}
          InputProps={{
            readOnly: true,
          }}
          disabled
        />
        <Typography display="block" sx={{ mb: 2 }} />
        <TextField
          label="Gender"
          variant="standard"
          defaultValue={contact.gender}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
        <TextField
          label="Date of Birth"
          variant="standard"
          defaultValue={contact.dob}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
      </Box>
      <Divider sx={{ mt: 1, mb: 1, width: 1 / 2 }} />
      <Box label="location">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Location
        </Typography>

        <TextField
          variant="standard"
          label="Street Address"
          defaultValue={contact.address.streetAddress}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
        <Typography display="block" sx={{ mb: 2 }} />
        <TextField
          variant="standard"
          label="City"
          defaultValue={contact.address.city}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
        <TextField
          variant="standard"
          label="Province"
          defaultValue={contact.address.province}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
        <TextField
          variant="standard"
          label="Postal Code"
          defaultValue={contact.address.postalCode}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
      </Box>
      <Divider sx={{ mt: 1, mb: 1, width: 1 / 2 }} />
      <Box label="contactInformation">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Contact Information
        </Typography>

        <TextField
          variant="standard"
          label="Mobile Phone"
          defaultValue={contact.phoneNumbers.mobilePhone}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
        <TextField
          variant="standard"
          label="Home Phone"
          defaultValue={contact.phoneNumbers.homePhone}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
        <TextField
          variant="standard"
          label="Work Phone"
          defaultValue={contact.phoneNumbers.workPhone}
          InputProps={{
            readOnly: true,
          }}
          disabled
        />
        <Typography display="block" sx={{ mb: 2 }} />
        <TextField
          label="Primary Email"
          variant="standard"
          defaultValue={contact.emailAddress1}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
        <TextField
          label="Work Email"
          variant="standard"
          defaultValue={contact.emailAddress2}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mr: 2, width: "15%" }}
          disabled
        />
      </Box>
      <Divider sx={{ mt: 1, mb: 1, width: 1 / 2 }} />
    </Box>
  );
};

export default ContactInfo;
