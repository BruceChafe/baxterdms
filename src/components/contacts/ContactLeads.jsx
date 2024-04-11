import React from "react";
import {
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Stack,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { useFetchLeads } from "../../../hooks/FetchLeads";
import SortingTable from "../tables/SortingTable";
import { Link } from "react-router-dom";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const datePart = date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const timePart = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return [datePart, timePart];
};

const columns = [
  { field: "action", header: "Actions" },
  { field: "createdDate", header: "Created Date" },
  { field: "leadStatus", header: "Lead Status" },
  { field: "leadDetails", header: "Details" },
  { field: "leadVehicles", header: "Vehicle" },
  { field: "leadVehicles", header: "Employee" },
  { field: "leadDealership", header: "Dealership" },
];

const ContactLeads = ({ contact }) => {
  const { leads, loading, error } = useFetchLeads(contact?.leadNumbers || []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error}</Alert>;

  const leadsRows = leads.map((lead) => {
    const [datePart, timePart] = formatTimestamp(lead.timestamp); // Call formatTimestamp here

    return {
      action: (
        <Tooltip title="Open Lead">
          <IconButton
            component={Link}
            to={`/leads/${lead.leadNumber}`}
            color="primary"
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
        <>
          <Stack>
            <Typography variant="body2" component="div">
              Lead No. {lead.leadNumber}
            </Typography>
            <Typography variant="body2" component="div">
              Type: {lead.leadType}
            </Typography>
            <Typography variant="body2" component="div">
              Source: {lead.leadSource}
            </Typography>
          </Stack>
        </>
      ),
      leadDealership: lead.leadDealership,
      leadVehicles: (
        <>
          <Typography>Coming soon.</Typography>
        </>
      ),
      leadNumber: lead.leadNumber,
    };
  });

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <SortingTable
        data={leadsRows}
        columns={columns}
        defaultSortField="createdDate"
        defaultSortDirection="desc"
      />
    </Paper>
  );
};

export default ContactLeads;
