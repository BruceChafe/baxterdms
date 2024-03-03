import React from "react";
import { Typography, Paper } from "@mui/material";
import SortingTable from "../tables/SortingTable";

const LeadHistory = ({ leadData, tasks }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const leadHistoryRows = leadData.history.map((item) => ({
    timestamp: formatTimestamp(Array.isArray(item) ? item[0] : item),
    type: Array.isArray(item) ? item[1] : "",
  }));

  const leadTasksRows = tasks.map((task) => ({
    timestamp: formatTimestamp(task.timestamp),
    type: task.type,
    employee: task.employee,
    subject: task.subject,
    additionalInfo: task.additionalInfo,
    status: task.status,
  }));

  const combinedRows = [...leadHistoryRows, ...leadTasksRows];

  const columns = [
    { field: "timestamp", header: "Timestamp" },
    { field: "type", header: "Type" },
    { field: "employee", header: "Employee" },
    { field: "subject", header: "Subject" },
    { field: "additionalInfo", header: "Additional Info" },
    { field: "status", header: "Status" },
  ];

  const handleRowClick = (row) => {
    console.log("Clicked row:", row);
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <SortingTable
        data={combinedRows}
        columns={columns}
        defaultSortKey="timestamp"
        defaultSortDirection="descending"
        action={handleRowClick}
      />
    </Paper>
  );
};

export default LeadHistory;
