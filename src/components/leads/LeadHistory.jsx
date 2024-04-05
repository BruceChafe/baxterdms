import React, { useState } from "react";
import {
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Box,
  Stack,
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

  const leadEmailsRows = emails.map((email) => {
    const [datePart, timePart] = formatTimestamp(email.timestamp);

    return {
      timestamp: (
        <Stack>
          <Typography variant="body2">{datePart}</Typography>
          <Typography variant="body2">{timePart}</Typography>
        </Stack>
      ),
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
    };
  });

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
    <Box sx={{ mb: 5 }}>
      <Paper sx={{ p: 3 }}>
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
    </Box>
  );
};

export default LeadHistory;
