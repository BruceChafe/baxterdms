import React, { useState } from "react";
import {
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import SortingTable from "../tables/SortingTable";
import { useFetchLeadTasks } from "../../hooks/FetchLeadTasks";
import { useFetchLeadEmails } from "../../hooks/FetchLeadEmails";
import UseSentEmailDialog from "../../hooks/SentEmailDialog";

const LeadHistory = ({ leadData }) => {
  const leadNumber = leadData?.leadNumber;
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useFetchLeadTasks(leadNumber);
  const {
    emails,
    loading: emailsLoading,
    error: emailsError,
  } = useFetchLeadEmails(leadNumber);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [currentEmailData, setCurrentEmailData] = useState({});

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleEmailClick = (emailData) => {
    setCurrentEmailData(emailData);
    setEmailDialogOpen(true);
  };

  const leadHistoryRows = leadData.history.map((history) => ({
    timestamp: formatTimestamp(history.timestamp),
    activity: history.activity,
  }));

  const leadTasksRows = tasks.map((task) => ({
    timestamp: formatTimestamp(task.timestamp),
    activity: task.activity + " - " + task.type,
    activityDetails: `Priority: ${
      task.priority
    }\nFollow Up Date: ${formatTimestamp(task.followUpDate)}\nStatus: ${
      task.status
    }`,
    subject: task.subject,
    additionalInfo: task.additionalInfo,
    status: task.status,
  }));

  const leadEmailsRows = emails.map((email) => ({
    timestamp: formatTimestamp(email.timestamp),
    activity: email.activityType,
    activityDetails: (
      <>
        <Typography variant="body2" component="div">
          From: {email.from}
        </Typography>
        <Typography variant="body2" component="div">
          To: {email.to}
        </Typography>
        <Typography variant="body2" component="div">
          Subject: {email.subject}
        </Typography>

        <Tooltip title="View Sent Email">
          <IconButton onClick={() => handleEmailClick(email)} color="primary">
            <MarkEmailReadIcon />
          </IconButton>
        </Tooltip>
      </>
    ),
  }));

  const combinedRows = [
    ...leadHistoryRows,
    ...leadTasksRows,
    ...leadEmailsRows,
  ];

  const columns = [
    { field: "timestamp", header: "Timestamp" },
    { field: "activity", header: "Activity" },
    { field: "activityDetails", header: "Details" },
  ];

  if (tasksLoading || emailsLoading) return <CircularProgress />;
  if (tasksError) return <Alert severity="error">{tasksError}</Alert>;
  if (emailsError) return <Alert severity="error">{emailsError}</Alert>;

  return (
    <>
      <Paper sx={{ p: 3, mb: 2 }}>
        <SortingTable
          data={combinedRows}
          columns={columns}
          defaultSortKey="timestamp"
          defaultSortDirection="descending"
        />
      </Paper>
      <UseSentEmailDialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        emailData={currentEmailData}
      />
    </>
  );
};

export default LeadHistory;
