import React from 'react';
import { Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useFetchLeads } from '../../hooks/FetchLeads';

const ContactLeads = ({ contact }) => {
  const leadNumbers = contact?.leadNumbers || [];
  const { leads, loading, error } = useFetchLeads(leadNumbers);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error}</Alert>;

  return (
    <>
      {leads.length > 0 ? (
        leads.map((lead, index) => (
          <Paper key={index} sx={{ p: 3, mb: 2 }}>
            <Typography>Lead Number: {lead.leadNumber}</Typography>
            <Typography>Lead Number: {lead.leadStatus}</Typography>
          </Paper>
        ))
      ) : (
        <Typography>No leads found.</Typography>
      )}
    </>
  );
};

export default ContactLeads;
