import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Divider,
  Box,
  Button,
  Grid,
  MenuItem
} from "@mui/material";
import { Navigate } from 'react-router-dom'

const NewLeadFields = [
  { label: "Dealership", key: "leadDealership" },
  { label: "Sales Consultant", key: "leadSalesConsultant" },
  { label: "Source", key: "leadSource" },
  { label: "Type", key: "leadType" },
  { label: "Status", key: "leadStatus" },
];

const NewLeadForm = ({ onCloseForm, contactId }) => {
  const [formData, setFormData] = useState({});
  const [filledFields, setFilledFields] = useState({});
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/configLeads/1")
      .then((response) => response.json())
      .then((configData) => {
        const sourceOptions = configData.leadSourceActive || [];
        const typeOptions = configData.leadTypeActive || [];

        setSourceOptions(sourceOptions);
        setTypeOptions(typeOptions);

      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  }, []);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
    setFilledFields((prevFilled) => ({ ...prevFilled, [key]: !!value }));
  };

  const handleCreate = () => {
    setFormSubmitted(true);

    const allMandatoryFieldsFilled = NewLeadFields.every(
      (field) => !!formData[field.key]
    );

    if (allMandatoryFieldsFilled) {
      const newLeadNumber = Math.floor(Math.random() * 1000) + 1000;

      fetch(`http://localhost:8000/Contacts/${contactId}`)
        .then((response) => response.json())
        .then((existingContact) => {
          const existingLeadNumbers = existingContact.leadNumbers || [];

          return fetch(`http://localhost:8000/Contacts/${contactId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              leadNumbers: [...existingLeadNumbers, newLeadNumber],
            }),
          });
        })
        .then((response) => response.json())
        .then((updatedContact) => {
          const returnedLeadNumbers = updatedContact.leadNumbers || [];

          console.log("Returned Lead Numbers:", returnedLeadNumbers);

          const contactId = updatedContact.dmsID;

          return fetch("http://localhost:8000/leads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              leadNumber: newLeadNumber,
              dmsID: contactId,
              ...formData,
            }),
          });
        })
        .then((response) => response.json())
        .then((newLead) => {
          setMessage("Lead created successfully!");
          setFormData({});
          setFilledFields([]);
  
          console.log("New Lead:", newLead);
  
          return <Navigate to={`/leads/lead/${newLead.id}`} />;
        })
        .catch((error) => {
          console.error("Error creating lead:", error);
          setMessage("Error creating lead.");
        });
      } else {
        setMessage("Please fill out all mandatory fields.");
      }
    };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleCreate();
    }
  };

  const renderTextField = (label, key) => {
    const isMandatory = NewLeadFields.find((field) => field.key === key);
    const isFilled = filledFields[key];
    const showError = formSubmitted && isMandatory && !isFilled;
  
    if (key === "leadSource") {
      return (
        <TextField
          select
          variant="outlined"
          label={label}
          value={formData[key] || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ mb: 2, width: "100%" }}
          required={!!isMandatory}
          error={showError}
          helperText={showError ? "This field is required." : ""}
        >
          {sourceOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
    }
  
    if (key === "leadType") {
      return (
        <TextField
          select
          variant="outlined"
          label={label}
          value={formData[key] || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ mb: 2, width: "100%" }}
          required={!!isMandatory}
          error={showError}
          helperText={showError ? "This field is required." : ""}
          key={key} // Add key prop with a unique value
        >
          {typeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
    }
  
    return (
      <TextField
        variant="outlined"
        label={label}
        value={formData[key] || ""}
        onChange={(e) => handleInputChange(key, e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ mb: 2, width: "100%" }}
        required={!!isMandatory}
        error={showError}
        helperText={showError ? "This field is required." : ""}
      />
    );
  };
  

  const renderSection = (sectionLabel, fields) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {sectionLabel}
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} key={field.label}>
            {renderTextField(field.label, field.key)}
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ mt: 2, mb: 2 }} />
    </Box>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        New Lead Form
      </Typography>
      {renderSection("Basic Information", NewLeadFields)}
      <Button variant="outlined" onClick={onCloseForm} sx={{ mb: 2 }}>
        Back
      </Button>
      <Button variant="outlined" onClick={handleCreate} sx={{ mb: 2, ml: 2 }}>
        Create
      </Button>
      <Typography variant="body1" color="error" sx={{ mt: 1, mb: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default NewLeadForm;