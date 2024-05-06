import React from 'react';
import {
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Stack,
  Box,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { Link } from 'react-router-dom';
import { useFetchContactLeads } from '../../../hooks/FetchContactLeads';
import SortingTable from '../tables/SortingTable';
import { useSnackbar } from '../../context/SnackbarContext'; // ensure the path is correct

const formatTimestamp = (timestamp) => {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  return [
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  ];
};

const columns = [
  { field: 'action', header: 'Actions' },
  { field: 'createdDate', header: 'Created Date' },
  { field: 'leadStatus', header: 'Lead Status' },
  { field: 'leadDetails', header: 'Details' },
  { field: 'leadVehicles', header: 'Vehicle' },
  { field: 'leadEmployee', header: 'Employee' },
  { field: 'leadDealership', header: 'Dealership' },
];

const ContactLeads = ({ contact }) => {
  const { leads, loading, error } = useFetchContactLeads(contact?.leadIDs || []);
  const { showSnackbar } = useSnackbar(); // Use the snackbar context

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '73vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    showSnackbar(`Error: Could not fetch leads due to ${error.message || 'a network error'}`, 'error');
    return (
      <Paper
        sx={{
          border: 'solid',
          borderColor: 'divider',
          p: 1,
          height: '73vh',
          overflow: 'auto',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Error: Could not fetch leads due to {error.message || 'a network error'}
          </Alert>
        </Box>
      </Paper>
    );
  }

  if (!leads.length) {
    return (
      <Paper
        sx={{
          border: 'solid',
          borderColor: 'divider',
          p: 1,
          height: '73vh',
          overflow: 'auto',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Alert severity="info">No leads found for this contact.</Alert>
        </Box>
      </Paper>
    );
  }

  const leadsRows = leads.map((lead) => {
    const [datePart, timePart] = formatTimestamp(lead.timestamp);
    return {
      action: (
        <Tooltip title="Open Lead">
          <IconButton
            component={Link}
            to={`/leads/${lead.leadId}`}
            color="primary"
            aria-label="Open Lead"
          >
            <LaunchIcon />
          </IconButton>
        </Tooltip>
      ),
      createdDate: (
        <Stack>
          <Typography variant="body2">{datePart}</Typography>
          <Typography variant="body2">{timePart}</Typography>
        </Stack>
      ),
      leadStatus: lead.leadStatus,
      leadDetails: (
        <Stack>
          <Typography variant="body2" component="div">
            Type: {lead.leadType}
          </Typography>
          <Typography variant="body2" component="div">
            Source: {lead.leadSource}
          </Typography>
        </Stack>
      ),
      leadDealership: lead.leadDealership,
      leadVehicles: <Typography>Coming soon.</Typography>,
      leadNumber: lead.leadNumber,
    };
  });

  return (
    <Paper
      sx={{
        border: 'solid',
        borderColor: 'divider',
        p: 1,
        height: '73vh',
        overflow: 'auto',
      }}
    >
      <Box sx={{ p: 3 }}>
        <SortingTable
          data={leadsRows}
          columns={columns}
          defaultSortField="createdDate"
          defaultSortDirection="desc"
        />
      </Box>
    </Paper>
  );
};

export default ContactLeads;
