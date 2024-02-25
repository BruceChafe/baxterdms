import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Divider,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
} from "@mui/material";

const NewLeadFields = [
  { label: "Dealership", key: "leadDealership" },
  { label: "Sales Consultant", key: "leadSalesConsultant" },
  { label: "Source", key: "leadSource" },
  { label: "Type", key: "leadType" },
  { label: "Status", key: "leadStatus" },
];

const NewLeadForm = ({ onCloseForm, contactId, newContactId }) => {
  const [formData, setFormData] = useState({});
  const [filledFields, setFilledFields] = useState({});
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [dealershipOptions, setDealershipOptions] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:8000/configLeads/1")
      .then((response) => response.json())
      .then((configData) => {
        const sourceOptions = configData.leadSourceActive || [];
        const typeOptions = configData.leadTypeActive || [];
        const statusOptions = configData.leadStatusActive || [];
        const dealershipOptions = configData.leadDealershipActive || [];

        setSourceOptions(sourceOptions);
        setTypeOptions(typeOptions);
        setDealershipOptions(dealershipOptions);
        setStatusOptions(statusOptions);
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
  
      fetch("http://localhost:8000/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadNumber: newLeadNumber,
          dmsID: contactId,
          ...formData,
        }),
      })
        .then((response) => response.json())
        .then((newLead) => {
          setMessage("Lead created successfully!");
          setFormData({});
          setFilledFields([]);
  
          console.log("New Lead:", newLead);
  
          // Associate the lead number with the contact
          fetch(`http://localhost:8000/contacts/${contactId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              leadNumbers: [newLeadNumber],
            }),
          });
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

    if (key === "leadDealership") {
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
          {dealershipOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (key === "leadStatus") {
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
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
    }

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
          key={key}
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
    <Box>
      <Typography variant="h5" mb={2}>
        {sectionLabel}
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} key={field.label}>
            {renderTextField(field.label, field.key)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        New Lead
      </Typography>
      <Divider />
      <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
        <Box mb={1} mt={1} p={1}>
          {renderSection("Basic Information", NewLeadFields)}
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
              onClick={handleCreate}
            >
              Create
            </Button>
          </Grid>
        </Box>
      </Paper>
      <Typography variant="body1" color="error" sx={{ mt: 1, mb: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default NewLeadForm;