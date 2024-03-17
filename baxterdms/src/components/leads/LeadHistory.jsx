import React from "react";
import { Typography, Paper, CircularProgress, Alert, Box } from "@mui/material";
import SortingTable from "../tables/SortingTable";
import { useFetchLeadTasks } from "../../hooks/FetchLeadTasks";
import { useFetchLeadEmails } from "../../hooks/FetchLeadEmails";

const LeadHistory = ({ leadData }) => {
  const leadNumber = leadData?.leadNumber;
  const { tasks, loading: tasksLoading, error: tasksError } = useFetchLeadTasks(leadNumber);
  const { emails, loading: emailsLoading, error: emailsError } = useFetchLeadEmails(leadNumber);

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
    activity: task.activity + " - " + task.type, // Combining activity and type
    activityDetails: `Priority: ${task.priority}\nFollow Up Date: ${formatTimestamp(task.followUpDate)}\nStatus: ${task.status}`,
    subject: task.subject,
    additionalInfo: task.additionalInfo,
    status: task.status,
  }));
  

  const leadEmailsRows = emails.map((email) => ({
    timestamp: formatTimestamp(email.timestamp),
    activity: email.activityType,
    activityDetails: `From: ${email.from}\nTo: ${email.to}\nSubject: ${email.subject}`, // Modified to include From, To, and Subject
    subject: email.subject,
    additionalInfo: email.body,
  })); 

  const combinedRows = [...leadHistoryRows, ...leadTasksRows, ...leadEmailsRows];

  const columns = [
    { field: "timestamp", header: "Timestamp" },
    { field: "activity", header: "Activity" },
    { field: "activityDetails", header: "Details" },
  ];

  if (tasksLoading || emailsLoading) return <CircularProgress />;
  if (tasksError) return <Alert severity="error">{tasksError}</Alert>;
  if (emailsError) return <Alert severity="error">{emailsError}</Alert>;

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <SortingTable
        data={combinedRows}
        columns={columns}
        defaultSortKey="timestamp"
        defaultSortDirection="descending"
      />
    </Paper>
  );
};

export default LeadHistory;
