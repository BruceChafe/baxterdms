// LeadInfo.js

import React, { useState, useEffect } from "react";
import { Typography, TextField, Divider, Box, Grid, MenuItem, Paper } from "@mui/material";

const LeadInfo = ({ lead, onSaveLeadInfo, onInfoChange }) => {
  const [editedLead, setEditedLead] = useState(null);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [dealershipOptions, setDealershipOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/configLeads/1")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch configuration data");
        }
        return response.json();
      })
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

  useEffect(() => {
    setEditedLead({ ...lead });
  }, [lead]);

  const handleDropdownChange = (key, value) => {
    setEditedLead({
      ...editedLead,
      [key]: value,
    });
    onInfoChange(true); // Notify parent component of changes
  };

  useEffect(() => {
    if (editedLead) {
      onSaveLeadInfo(editedLead);
    }
  }, [editedLead, onSaveLeadInfo]);

  const renderDropdownMenu = (label, key, options, isDisabled = false) => (
    <TextField
      select
      label={label}
      value={editedLead[key] || ""}
      onChange={(e) => handleDropdownChange(key, e.target.value)}
      fullWidth
      disabled={isDisabled}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <>
      {editedLead && (
        <Box>
          <Paper sx={{ p: 1, mb: 2 }}>
            <Box mb={1} mt={1} p={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderDropdownMenu(
                    "Lead Source",
                    "leadSource",
                    sourceOptions
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDropdownMenu(
                    "Lead Dealership",
                    "leadDealership",
                    dealershipOptions,
                    true
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDropdownMenu("Lead Type", "leadType", typeOptions)}
                </Grid>
                <Grid item  sm={6}>
                  {renderDropdownMenu(
                    "Lead Status",
                    "leadStatus",
                    statusOptions
                  )}
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default LeadInfo;
