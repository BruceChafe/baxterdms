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
import { Link } from "react-router-dom";
import { useFetchContactLeads } from "../../../hooks/FetchContactLeads";
import SortingTable from "../tables/SortingTable";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
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
  { field: "leadEmployee", header: "Employee" },
  { field: "leadDealership", header: "Dealership" },
];

const ContactLeads = ({ contact }) => {
  const { leads, loading, error } = useFetchContactLeads(
    contact?.leadIDs || []
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (leads.length === 0) return <Alert severity="info">No leads found for this contact.</Alert>;

  const leadsRows = leads.map((lead) => {
    const [datePart, timePart] = formatTimestamp(lead.timestamp);

    return {
      action: (
        <Tooltip title="Open Lead">
          <IconButton
            component={Link}
            to={`/leads/${lead.leadId}`}
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
