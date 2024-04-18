import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import DropdownMenu from '../fields/renderDropdownMenu';
import { useFetchLeadConfig } from '../../../hooks/FetchLeadConfig';

const LeadInfo = ({ lead, onSaveLeadInfo, onInfoChange }) => {
  const { sourceOptions, typeOptions, dealershipOptions, statusOptions, loading, error } =
    useFetchLeadConfig();

  // Update the initial state with a function to prevent undefined values
  const [editedLead, setEditedLead] = useState(() => ({
    leadSource: lead?.leadSource || '',
    leadDealership: lead?.leadDealership || '',
    leadType: lead?.leadType || '',
    leadStatus: lead?.leadStatus || ''
  }));

  useEffect(() => {
    // Ensure the component reacts properly to changes in lead props
    setEditedLead({
      leadSource: lead?.leadSource || '',
      leadDealership: lead?.leadDealership || '',
      leadType: lead?.leadType || '',
      leadStatus: lead?.leadStatus || ''
    });
  }, [lead]);

  const handleDropdownChange = (key, value) => {
    const updatedLead = { ...editedLead, [key]: value };
    setEditedLead(updatedLead);
    onInfoChange(true);
    onSaveLeadInfo(updatedLead);
  };

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box mb={1} mt={1} p={1}>
        <Grid container spacing={2}>
          {[
            { label: 'Lead Source', key: 'leadSource', options: sourceOptions },
            { label: 'Lead Dealership', key: 'leadDealership', options: dealershipOptions },
            { label: 'Lead Type', key: 'leadType', options: typeOptions },
            { label: 'Lead Status', key: 'leadStatus', options: statusOptions }
          ].map(field => (
            <Grid item xs={12} sm={6} key={field.key}>
              <DropdownMenu
                label={field.label}
                value={editedLead[field.key] || ''}
                options={field.options}
                onChange={(e) => handleDropdownChange(field.key, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default LeadInfo;
