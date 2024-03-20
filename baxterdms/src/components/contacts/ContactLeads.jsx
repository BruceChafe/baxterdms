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
import { useFetchLeads } from "../../hooks/FetchLeads";
import SortingTable from "../tables/SortingTable";
import { Link } from "react-router-dom";

const ContactLeads = ({ contact }) => {
  const { leads, loading, error } = useFetchLeads(contact?.leadNumbers || []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error}</Alert>;

  const leadsRows = leads.map((lead) => ({
    action: (
      <Tooltip title="Open Lead">
        <IconButton
          component={Link}
          to={`/leads/${lead.leadNumber}`} // Adjust the URL as needed
          color="primary"
        >
          <LaunchIcon />
        </IconButton>
      </Tooltip>
    ),
    createdDate: lead.timestamp,
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
        <Typography>coming soon.</Typography>
      </>
    ),
    leadDealership: lead.leadDealership,
    leadNumber: lead.leadNumber,
  }));

  const columns = [
    { field: "action", header: "Actions" },
    { field: "createdDate", header: "Created Date" },
    { field: "leadStatus", header: "Lead Status" },
    { field: "leadDetails", header: "Details" },
    { field: "leadVehicles", header: "Vehicle" },
    { field: "leadVehicles", header: "Employee" },
    { field: "leadDealership", header: "Details" },
  ];

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <SortingTable
        data={leadsRows}
        columns={columns}
        defaultSortField="timestamp"
        defaultSortDirection="desc"
        action=""
        baseNavigationUrl="/leads"
      />
    </Paper>
  );
};

export default ContactLeads;
