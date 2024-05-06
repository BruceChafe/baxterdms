import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDoc, doc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import {
  Typography, TextField, Divider, Box, Button, Grid, MenuItem, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewLeadForm = ({ onCloseForm, contactId }) => {
  const [formData, setFormData] = useState({});
  const [optionsMap, setOptionsMap] = useState({});
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfigData = async () => {
      const docRef = doc(db, "configData", "leadsConfig");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOptionsMap({
          leadDealership: docSnap.data().leadDealershipActive,
          leadSource: docSnap.data().leadSourceActive,
          leadType: docSnap.data().leadTypeActive,
          leadStatus: docSnap.data().leadStatusActive,
          leadSalesConsultant: ["Fred"],
        });
      } else {
        console.log("No such document!");
      }
    };
    fetchConfigData();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleCreate = async () => {
    setFormSubmitted(true);
    const allMandatoryFieldsFilled = Object.keys(optionsMap).every(
      (key) => optionsMap[key].includes(formData[key])
    );
    if (allMandatoryFieldsFilled) {
      try {
        const newLeadRef = await addDoc(collection(db, "leads"), {
          ...formData,
          contactIDs: [contactId],
          timestamp: new Date(),
        });
        await updateDoc(doc(db, "contacts", contactId), {
          leadIDs: arrayUnion(newLeadRef.id),
        });
        setMessage("Lead created successfully!");
        setFormData({});
        onCloseForm();
        navigate(`/leads/${newLeadRef.id}`);
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
      onChange={(e) => handleInputChange(key, e.target.value)}
      required={optionsMap[key] && optionsMap[key].length > 0}
      error={formSubmitted && !formData[key]}
      helperText={
        formSubmitted && !formData[key] ? "This field is required." : ""
      }
      sx={{ mb: 2, width: "100%" }}
    >
      {optionsMap[key]?.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <Typography variant="h4" mb={2}>
        New Lead
      </Typography>
      <Divider />
      <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
        {Object.keys(optionsMap).map((key) => (
          <Grid item xs={12} sm={6} key={key}>
            {optionsMap[key] && renderTextField(`Lead ${key.replace("lead", "")}`, key)}
          </Grid>
        ))}
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreate}
        sx={{ mt: 2 }}
      >
        Create
      </Button>
      <Button variant="outlined" onClick={onCloseForm} sx={{ mt: 2, ml: 2 }}>
        Cancel
      </Button>
      {message && (
        <Typography color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default NewLeadForm;
