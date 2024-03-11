import React from "react";
import { Typography, Paper } from "@mui/material";
import SortingTable from "../tables/SortingTable";

const LeadHistory = ({ leadData, tasks, emails }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const leadHistoryRows = leadData.history.map((history) => ({
    timestamp: formatTimestamp(history.timestamp),
    activity: history.activity,

  }));

  const leadTasksRows = tasks.map((task) => ({
    timestamp: formatTimestamp(task.timestamp),
    activity: task.activity,
    employee: task.employee,
    subject: task.subject,
    additionalInfo: task.additionalInfo,
    status: task.status,
  }));

  const leadEmailsRows = emails.map((email) => ({
  timestamp: formatTimestamp(email.timestamp),
  activity: email.activity,
  
  }))

  const combinedRows = [...leadHistoryRows, ...leadTasksRows, ...leadEmailsRows];

  const columns = [
    { field: "timestamp", header: "Timestamp" },
    { field: "activity", header: "Type" },
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
