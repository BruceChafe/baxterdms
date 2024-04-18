import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
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

const NewLeadForm = ({ onCloseForm, contactId }) => {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Configuration options stored in a state object
  const optionsMap = {
    leadDealership: ["Dealership A", "Dealership B"],
    leadSalesConsultant: ["fred"], // Add options for sales consultants as needed
    leadSource: ["Online", "Referral", "Walk-in"],
    leadType: ["New", "Used"],
    leadStatus: ["Open", "Closed", "Follow-up"]
  };

  const handleInputChange = (key, value) => {
    setFormData(prevData => ({ ...prevData, [key]: value }));
  };

  const handleCreate = async () => {
    setFormSubmitted(true);
    const allMandatoryFieldsFilled = NewLeadFields.every(field => !!formData[field.key]);
    if (allMandatoryFieldsFilled) {
      try {
        const newLeadRef = await addDoc(collection(db, "leads"), {
          ...formData,
          contactIDs: [contactId],
          timestamp: new Date()
        });

        // Update the contact with the new lead ID
        await updateDoc(doc(db, "contacts", contactId), {
          leadIDs: arrayUnion(newLeadRef.id)
        });

        setMessage("Lead created successfully!");
        setFormData({});
        onCloseForm(); // Optionally close form or reset state
      } catch (error) {
        console.error("Error creating lead:", error);
        setMessage("Error creating lead: " + error.message);
      }
    } else {
      setMessage("Please fill out all mandatory fields.");
    }
  };

  const renderTextField = (label, key) => (
    <TextField
      select
      fullWidth
      label={label}
      value={formData[key] || ""}
      onChange={e => handleInputChange(key, e.target.value)}
      required={NewLeadFields.some(field => field.key === key)}
      error={formSubmitted && !formData[key]}
      helperText={formSubmitted && !formData[key] ? "This field is required." : ""}
      sx={{ mb: 2, width: "100%" }}
    >
      {optionsMap[key].map(option => (
        <MenuItem key={option} value={option}>{option}</MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <Typography variant="h4" mb={2}>New Lead</Typography>
      <Divider />
      <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
        {NewLeadFields.map(field => (
          <Grid item xs={12} sm={6} key={field.key}>
            {renderTextField(field.label, field.key)}
          </Grid>
        ))}
      </Paper>
      <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mt: 2 }}>
        Create
      </Button>
      <Button variant="outlined" onClick={onCloseForm} sx={{ mt: 2, ml: 2 }}>
        Cancel
      </Button>
      {message && (
        <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>
      )}
    </Box>
  );
};

export default NewLeadForm;

